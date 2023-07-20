import {
  EmailAuthProvider,
  deleteUser,
  reauthenticateWithCredential,
} from "firebase/auth";
import { db } from "../../../../../services/firebase";
import { currentUser } from "../../../../../utils/query.helper";
import { collection, deleteDoc, doc } from "firebase/firestore";

export async function deleteAccount(password: string) {
  const user = await currentUser();
  if (!user) return Promise.reject(false);
  const credential = EmailAuthProvider.credential(user?.email, password);

  const collectionsToDelete = ["assets", "balance", "entry", "users", "alerts"];
  const deletePromises = collectionsToDelete.map((collectionName) =>
    deleteDoc(doc(collection(db, collectionName), user.uid))
  );

  await Promise.all(deletePromises);

  await reauthenticateWithCredential(user, credential);
  await deleteUser(user);
  return Promise.resolve("Success");
}
