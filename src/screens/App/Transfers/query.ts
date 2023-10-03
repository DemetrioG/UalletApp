import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { currentUser } from "../../../utils/query.helper";
import { ListTransfers, ValidatedTransfersDTO } from "./types";
import { db } from "../../../services/firebase";
import {
  convertDateToDatabase,
  getMonthDate,
} from "../../../utils/date.helper";
import { realToNumber } from "../../../utils/number.helper";
import { ServerFilterFields } from "./ModalFilter/types";

type TTransfersList = {
  month: number;
  year: number;
  filters?: ServerFilterFields;
};

export async function listTransfer(props: TTransfersList) {
  const user = await currentUser();
  if (!user) return Promise.reject();

  const [initialDate, finalDate] = getMonthDate(props.month, props.year);

  let baseQuery = query(collection(db, "transfers", user.uid, "Real"));

  if (props.filters?.initial_date) {
    baseQuery = query(
      baseQuery,
      where("date", ">=", convertDateToDatabase(props.filters?.initial_date))
    );
  } else {
    baseQuery = query(baseQuery, where("date", ">=", initialDate));
  }

  if (props.filters?.final_date) {
    baseQuery = query(
      baseQuery,
      where("date", "<=", convertDateToDatabase(props.filters?.final_date))
    );
  } else {
    baseQuery = query(baseQuery, where("date", "<=", finalDate));
  }

  if (props.filters?.origin_account) {
    baseQuery = query(
      baseQuery,
      where("originAccount", "==", props.filters?.origin_account)
    );
  }

  if (props.filters?.destination_account) {
    baseQuery = query(
      baseQuery,
      where("destinationAccount", "==", props.filters?.destination_account)
    );
  }

  const transfers = await getDocs(baseQuery);

  const transferPromises = transfers.docs?.map(async (transfer) => {
    const transferData = transfer.data();
    const [originData, destinationData] = await Promise.all([
      getAccountData(user.uid, transferData.originAccount),
      getAccountData(user.uid, transferData.destinationAccount),
    ]);
    return {
      ...transferData,
      originAccountName: originData.name,
      destinationAccountName: destinationData.name,
    };
  });

  return (await Promise.all(transferPromises)) as ListTransfers[];
}

async function getAccountData(uid: string, accountValue: string) {
  const accountRef = await getDocs(
    query(
      collection(db, "accounts", uid, "accounts"),
      where("value", "==", accountValue)
    )
  );
  const [accountData] = accountRef.docs.map((doc) => doc.data());
  return accountData;
}

export async function createTransfer(formData: ValidatedTransfersDTO) {
  const user = await currentUser();
  if (!user) return Promise.reject();
  const id = await getLastId();

  const items = {
    ...formData,
    id: id,
    date: convertDateToDatabase(formData.date),
    value: realToNumber(formData.value),
  };

  const transferRef = doc(
    collection(db, "transfers", user.uid, "Real"),
    id.toString()
  );
  await setDoc(transferRef, items);

  const balanceRef = doc(
    collection(db, "balance", user.uid, "Real"),
    "balance"
  );
  const balanceSnapshot = await getDoc(balanceRef);
  const data = balanceSnapshot.data();
  if (!data) return Promise.reject("Saldo não encontrado");

  const originBalance = data[formData.originAccount].balance;
  const destinationBalance = data[formData.destinationAccount].balance;

  const balanceUpdate = {
    ...data,
    [formData.originAccount]: {
      balance: originBalance - realToNumber(formData.value),
    },
    [formData.destinationAccount]: {
      balance: destinationBalance + realToNumber(formData.value),
    },
  };

  await setDoc(balanceRef, balanceUpdate);
}

export async function updateTransfer(
  formData: ValidatedTransfersDTO,
  id: number
) {
  const user = await currentUser();
  if (!user) return Promise.reject();

  const transferSnapshot = await getDoc(
    doc(db, "transfers", user.uid, "Real", id.toString())
  );
  const data = transferSnapshot.data() as ListTransfers;
  if (!data) return Promise.reject("Transferência não encontrado");

  await deleteTransfer(data);
  return await createTransfer(formData);
}

export async function deleteTransfer(formData: ListTransfers) {
  const user = await currentUser();
  if (!user) return Promise.reject();

  const balanceRef = doc(
    collection(db, "balance", user.uid, "Real"),
    "balance"
  );
  const balanceSnapshot = await getDoc(balanceRef);
  const data = balanceSnapshot.data();
  if (!data) return Promise.reject("Saldo não encontrado");

  const originBalance = data[formData.originAccount].balance;
  const destinationBalance = data[formData.destinationAccount].balance;

  const balanceUpdate = {
    ...data,
    [formData.originAccount]: {
      balance: originBalance + formData.value,
    },
    [formData.destinationAccount]: {
      balance: destinationBalance - formData.value,
    },
  };

  await setDoc(balanceRef, balanceUpdate);

  const transferRef = doc(
    collection(db, "transfers", user.uid, "Real"),
    formData.id.toString()
  );
  return await deleteDoc(transferRef);
}

export async function getLastId() {
  const user = await currentUser();
  if (!user) return Promise.reject();

  const collectionRef = collection(db, "transfers", user.uid, "Real");
  const querySnapshot = await getDocs(
    query(collectionRef, orderBy("id", "desc"), limit(1))
  );

  let id = querySnapshot.size > 0 ? querySnapshot.docs[0].data().id + 1 : 1;
  return id;
}
