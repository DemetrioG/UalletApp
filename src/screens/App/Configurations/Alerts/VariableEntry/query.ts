import { currentUser } from "../../../../../utils/query.helper";
import { collection, doc, setDoc } from "firebase/firestore";
import { db } from "../../../../../services/firebase";

export async function registerAlert(value: number) {
  const user = await currentUser();
  if (!user) return Promise.reject();

  await setDoc(
    doc(collection(db, "alerts"), user.uid),
    {
      variableExpense: value,
    },
    { merge: true }
  );
}
