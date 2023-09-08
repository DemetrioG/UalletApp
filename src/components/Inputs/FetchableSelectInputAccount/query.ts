import { collection, getDocs } from "firebase/firestore";
import { currentUser } from "../../../utils/query.helper";
import { db } from "../../../services/firebase";

export async function listAccount() {
  const user = await currentUser();
  if (!user) return Promise.reject();

  const docs = await getDocs(collection(db, "accounts", user.uid, "accounts"));
  const data = docs.docs.map((doc) => doc.data());
  console.log(data);
  return data.map((segment) => {
    return {
      value: segment.value,
      label: segment.name,
    };
  });
}
