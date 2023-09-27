import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
  writeBatch,
} from "firebase/firestore";
import { db } from "../../../../../services/firebase";
import { authUser } from "../../../../../utils/query.helper";
import { ValidatedAccountDTO } from "./types";
import { realToNumber } from "../../../../../utils/number.helper";
import { stringToPath } from "../../../../../utils/general.helper";

export async function listAccount() {
  const user = await authUser();
  if (!user) return Promise.reject();

  return await getDocs(collection(db, "accounts", user.uid, "accounts"));
}

export async function createAccount(formData: ValidatedAccountDTO) {
  const user = await authUser();
  if (!user) return Promise.reject();
  const accountsCollection = collection(db, "accounts", user.uid, "accounts");
  await addDoc(accountsCollection, {
    ...formData,
    value: stringToPath(formData.name),
    balance: realToNumber(formData.balance),
  });

  const balanceCollection = collection(db, "balance", user.uid, "Real");
  const balanceRef = doc(balanceCollection, "balance");
  const balanceSnapshot = await getDoc(balanceRef);
  const balanceData = balanceSnapshot.data();
  await setDoc(balanceRef, {
    ...balanceData,
    [stringToPath(formData.name)]: { balance: 0 },
  });
}

export async function updateAccount(formData: ValidatedAccountDTO, id: string) {
  const user = await authUser();
  if (!user) return Promise.reject();

  const accountRef = doc(collection(db, "accounts", user.uid, "accounts"), id);
  const accountSnapshot = await getDoc(accountRef);
  const accountData = accountSnapshot.data();
  const account = accountData?.value;

  const batch = writeBatch(db);
  const updateData = { account: stringToPath(formData.name) };

  batch.update(accountRef, {
    name: formData.name,
    color: formData.color,
    value: stringToPath(formData.name),
    balance: realToNumber(formData.balance),
  });

  const updateEntries = async (collectionName: "Real" | "Projetado") => {
    const entriesSnapshot = await getEntries(user, collectionName, account);
    entriesSnapshot.docs.forEach((doc) => {
      const ref = doc.ref;
      batch.update(ref, { ...doc.data(), ...updateData });
    });
  };

  await Promise.all([updateEntries("Real"), updateEntries("Projetado")]);
  await batch.commit();

  const balanceRef = doc(
    collection(db, "balance", user.uid, "Real"),
    "balance"
  );
  const balanceSnapshot = await getDoc(balanceRef);
  const balanceData = balanceSnapshot.data();
  const balance = balanceData?.[account]?.balance || 0;
  const oldAccountBalance = accountData?.balance || 0;
  const newAccountBalance = realToNumber(formData.balance);
  await setDoc(balanceRef, {
    ...balanceData,
    [account]: { balance: balance + (newAccountBalance - oldAccountBalance) },
  });
}

export async function deleteAccount(id: string) {
  const user = await authUser();
  if (!user) return Promise.reject();

  const accountRef = doc(collection(db, "accounts", user.uid, "accounts"), id);
  const snapshot = await getDoc(accountRef);
  const account = snapshot.data()?.value;

  const [projectedEntries, realEntries] = await Promise.all([
    getEntries(user, "Projetado", account),
    getEntries(user, "Real", account),
  ]);

  const hasEntries =
    projectedEntries.docs.length > 0 || realEntries.docs.length > 0;

  if (hasEntries)
    return Promise.reject("Há lançamentos vinculados a esta conta.");

  const balanceRef = doc(
    collection(db, "balance", user.uid, "Real"),
    "balance"
  );
  const balanceSnapshot = await getDoc(balanceRef);
  const balanceData = balanceSnapshot.data();
  delete balanceData?.[account];
  await setDoc(balanceRef, balanceData);
  await deleteDoc(accountRef);
}

export async function checkIfAccountExist(account: string) {
  const user = await authUser();
  if (!user) return Promise.reject();

  const accountRef = collection(db, "accounts", user.uid, "accounts");
  const accountSnapshot = await getDocs(
    query(accountRef, where("name", "==", account))
  );

  return !(accountSnapshot.docs.length > 0);
}

async function getEntries(
  user: any,
  modality: "Real" | "Projetado",
  account: string
) {
  return await getDocs(
    query(
      collection(db, "entry", user.uid, modality),
      where("account", "==", account)
    )
  );
}
