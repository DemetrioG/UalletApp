import { currentUser } from "../../../../utils/query.helper";
import { collection, doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../../../services/firebase";

export async function getData() {
  const user = await currentUser();
  if (!user) return Promise.reject();

  return getDoc(doc(collection(db, "alerts"), user.uid)).then((v) => v.data());
}

export async function deleteData(index: string) {
  const user = await currentUser();
  if (!user) return Promise.reject();

  await setDoc(doc(collection(db, "alerts"), user.uid), {
    [index]: 0,
  });
}
