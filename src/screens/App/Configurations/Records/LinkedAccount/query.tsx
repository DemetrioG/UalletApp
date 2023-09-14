import { collection, getDocs, query, setDoc, where } from "firebase/firestore";
import { currentUser } from "../../../../../utils/query.helper";
import { ValidatedLinkedAccountDTO } from "./types";
import { db } from "../../../../../services/firebase";

export async function listLinkedAccounts() {
  const user = await currentUser();
  if (!user) return Promise.reject();

  return await getDocs(
    query(
      collection(db, "users"),
      where("sharedAccounts", "array-contains", { uid: user.uid })
    )
  );
}

export async function createLinkedAccount(formData: ValidatedLinkedAccountDTO) {
  const user = await currentUser();
  if (!user) return Promise.reject();

  const snapshot = await getDocs(
    query(collection(db, "users"), where("email", "==", formData.email))
  );

  const [doc] = snapshot.docs;
  if (!doc) return Promise.reject("Usuário não encontrado");

  const data = doc.data();

  data.shared_accounts = [
    ...data.shared_accounts,
    { uid: user.uid, linked: false },
  ];

  return await setDoc(doc.ref, data);
}

export async function checkIfEmailExist(email: string) {
  const user = await currentUser();
  if (!user) return Promise.reject();

  const userRef = collection(db, "users");
  const userSnapshot = await getDocs(
    query(userRef, where("email", "==", email))
  );

  return !(userSnapshot.docs.length > 0);
}
