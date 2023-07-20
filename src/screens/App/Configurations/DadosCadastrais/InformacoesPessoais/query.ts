import { collection, doc, getDoc } from "firebase/firestore";
import { db } from "../../../../../services/firebase";

export const getUser = async <T>(userUid: string) => {
  const docRef = doc(collection(db, "users"), userUid);
  const querySnapshot = await getDoc(docRef);

  return querySnapshot.data() as T;
};
