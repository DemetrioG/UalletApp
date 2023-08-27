import {
  addDoc,
  collection,
  doc,
  getDoc,
  serverTimestamp,
} from "firebase/firestore";
import { currentUser } from "../../../utils/query.helper";
import { ValidatedTicketsDTO } from "./types";
import { db } from "../../../services/firebase";

export async function sendTicket(formData: ValidatedTicketsDTO) {
  const user = await currentUser();
  if (!user) return Promise.reject(false);

  const userDoc = await getDoc(doc(db, "users", user.uid));
  if (!userDoc.exists()) return Promise.reject("Usuário não encontrado.");

  const userData = userDoc.data();

  const data = {
    uid: user.uid,
    email: userData?.email,
    name: userData?.name,
    schema: userData?.schema,
    profile: userData?.profile,
    type: formData.type,
    comment: formData.comment,
    createdAt: serverTimestamp(),
  };

  await addDoc(collection(db, "tickets"), data);
}
