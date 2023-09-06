import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  writeBatch,
} from "firebase/firestore";
import { db } from "../../../../../services/firebase";
import { currentUser } from "../../../../../utils/query.helper";
import { AccountDTO, ValidatedAccountDTO } from "./types";
import { realToNumber } from "../../../../../utils/number.helper";

export async function listAccount() {
  const user = await currentUser();
  if (!user) return Promise.reject();

  return await getDocs(collection(db, "accounts", user.uid, "accounts"));
}

export async function createAccount(formData: ValidatedAccountDTO) {
  const user = await currentUser();
  if (!user) return Promise.reject();

  return await addDoc(collection(db, "accounts", user.uid, "accounts"), {
    ...formData,
    balance: realToNumber(formData.balance),
  });
}

export async function updateAccount(formData: ValidatedAccountDTO, id: string) {
  const user = await currentUser();
  if (!user) return Promise.reject();

  const accountRef = doc(collection(db, "accounts", user.uid, "accounts"), id);
  const snapshot = await getDoc(accountRef);
  const account = snapshot.data()?.name;

  const batch = writeBatch(db);
  const updateData = { account: formData.name };

  batch.update(accountRef, {
    name: formData.name,
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
  return await batch.commit();
}

export async function deleteAccount(id: string) {
  const user = await currentUser();
  if (!user) return Promise.reject();

  const accountRef = doc(collection(db, "accounts", user.uid, "accounts"), id);
  const snapshot = await getDoc(accountRef);
  const account = snapshot.data()?.name;

  const [projectedEntries, realEntries] = await Promise.all([
    getEntries(user, "Projetado", account),
    getEntries(user, "Real", account),
  ]);

  const hasEntries =
    projectedEntries.docs.length > 0 || realEntries.docs.length > 0;

  if (hasEntries)
    return Promise.reject("Há lançamentos vinculados a esta conta.");

  return await deleteDoc(accountRef);
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
