import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { db } from "../../../services/firebase";
import {
  convertDateFromDatabase,
  convertDateToDatabase,
  getFinalDateMonth,
} from "../../../utils/date.helper";
import { realToNumber } from "../../../utils/number.helper";
import {
  createCollection,
  currentUser,
  updateCurrentBalance,
} from "../../../utils/query.helper";
import { ServerFilterFields } from "./ModalFilter/types";
import { ListEntries, ValidatedNewEntrieDTO } from "./types";

type TEntriesList = {
  month: number;
  year: number;
  modality: string;
  filters?: ServerFilterFields;
};

export const getEntries = async ({
  month,
  year,
  modality,
  filters,
}: TEntriesList) => {
  const user = await currentUser();
  if (!user) return Promise.reject(null);

  const initialDate = new Date(`${year}-${month}-01T00:00:00`);
  const finalDate = new Date(
    `${year}-${month}-${getFinalDateMonth(month, year)}T23:59:59`
  );

  let baseQuery = query(collection(db, "entry", user.uid, modality as string));

  if (filters?.segment)
    baseQuery = query(baseQuery, where("segment", "==", filters?.segment));

  if (filters?.type)
    baseQuery = baseQuery = query(
      baseQuery,
      where("type", "==", filters?.type)
    );

  if (filters?.initial_date) {
    baseQuery = query(
      baseQuery,
      where("date", ">=", convertDateToDatabase(filters?.initial_date))
    );
  } else {
    baseQuery = query(baseQuery, where("date", ">=", initialDate));
  }

  if (filters?.final_date) {
    baseQuery = query(
      baseQuery,
      where("date", "<=", convertDateToDatabase(filters?.final_date))
    );
  } else {
    baseQuery = query(baseQuery, where("date", "<=", finalDate));
  }

  const orderedQuery = query(baseQuery, orderBy("date", "desc"));

  return getDocs(orderedQuery);
};

export async function registerNewEntry(props: ValidatedNewEntrieDTO) {
  const { description, date, value, modality, segment, type } = props;
  const user = await currentUser();
  if (!user) return Promise.reject();

  let id = 1;

  /**
   * Busca o último ID de lançamentos cadastrados no banco para setar o próximo ID
   */
  const collectionRef = collection(db, "entry", user.uid, modality as string);
  const querySnapshot = await getDocs(
    query(collectionRef, orderBy("id", "desc"), limit(1))
  );

  querySnapshot.forEach((result) => {
    id += result.data().id;
  });

  const items: ListEntries & {
    consolidated?: { consolidated: boolean; wasActionShown: boolean };
  } = {
    id: id,
    date: convertDateToDatabase(date),
    type: type,
    description: description,
    modality: modality!,
    value: realToNumber(value),
  };

  if (modality === "Projetado") {
    items["consolidated"] = {
      consolidated: false,
      wasActionShown: false,
    };
  }

  if (segment) {
    items["segment"] = segment;
  }

  await createCollection("entry");

  /**
   *  Registra o novo lançamento no banco
   */
  await setDoc(
    doc(collection(db, "entry", user.uid, modality as string), id.toString()),
    items
  );

  await createCollection("balance");

  const docRef = `${Number(date.slice(3, 5)).toString()}_${date.slice(6, 10)}`;
  await updateCurrentBalance({
    modality: modality,
    sumBalance: type === "Receita",
    docDate: docRef,
    value: realToNumber(value),
  });

  return Promise.resolve();
}

export async function updateEntry(
  props: ValidatedNewEntrieDTO,
  idRegister: number,
  routeParams: ListEntries
) {
  const { description, date, value, modality, segment, type } = props;
  const user = await currentUser();
  if (!user) return Promise.reject();

  const items: ListEntries & {
    consolidated?: { consolidated: boolean; wasActionShown: boolean };
  } = {
    id: idRegister,
    date: convertDateToDatabase(date),
    type: type,
    description: description,
    modality: modality,
    value: realToNumber(value),
  };

  if (modality === "Projetado") {
    items["consolidated"] = {
      consolidated: false,
      wasActionShown: false,
    };
  }

  if (segment) {
    items["segment"] = segment;
  }

  await createCollection("entry");

  /**
   * Registra o novo lançamento no banco
   */
  await setDoc(
    doc(db, "entry", user.uid, modality!, idRegister.toString()),
    items
  );

  await createCollection("balance");

  const docRef = `${Number(date.slice(3, 5)).toString()}_${date.slice(6, 10)}`;
  await updateCurrentBalance({
    modality: modality,
    sumBalance: type === "Receita",
    docDate: docRef,
    value: realToNumber(value) - routeParams.value,
  });

  return Promise.resolve();
}

export async function deleteEntry(routeParams: ListEntries) {
  const { date, id, modality, type, value } = routeParams;
  const user = await currentUser();
  if (!user) return Promise.reject();

  const entryDocRef = doc(
    collection(db, "entry", user.uid, modality),
    id.toString()
  );
  await deleteDoc(entryDocRef);

  const docRef = `${Number(
    convertDateFromDatabase(date).slice(3, 5)
  ).toString()}_${convertDateFromDatabase(date).slice(6, 10)}`;
  await updateCurrentBalance({
    modality: modality,
    docDate: docRef,
    sumBalance: type === "Despesa",
    value: value,
  });

  return Promise.resolve();
}
