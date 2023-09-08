import { collection, getDocs } from "firebase/firestore";
import { currentUser } from "../../../utils/query.helper";
import { db } from "../../../services/firebase";

export async function listSegment() {
  const user = await currentUser();
  if (!user) return Promise.reject();

  const docs = await getDocs(collection(db, "segments", user.uid, "segments"));
  const data = docs.docs.map((doc) => doc.data());
  return data.map((segment) => {
    return {
      value: segment.value,
      label: segment.description,
    };
  });
}
