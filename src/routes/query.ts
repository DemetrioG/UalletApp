import { doc, getDoc } from "firebase/firestore";
import { currentUser } from "../utils/query.helper";
import { db } from "../services/firebase";

export async function getUserData() {
  const user = await currentUser();
  if (!user) return Promise.reject();

  const userSnapshot = await getDoc(doc(db, "users", user.uid));
  return userSnapshot.data()?.expirationDate;
}
