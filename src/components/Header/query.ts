import { doc, getDoc } from "firebase/firestore";
import { currentUser } from "../../utils/query.helper";
import { db } from "../../services/firebase";

export async function getData() {
  const user = await currentUser();

  if (!user) return Promise.reject(false);

  const defaultData = {
    name: "",
    completeName: "",
    email: "",
  };

  const userRef = doc(db, "users", user.uid);

  try {
    const docSnap = await getDoc(userRef);

    if (docSnap.exists()) {
      const data = {
        name: docSnap.data()?.name.split(" ", 1).toString(),
        completeName: docSnap.data()?.name,
        email: docSnap.data()?.email,
      };

      return data;
    } else {
      return defaultData;
    }
  } catch (error) {
    return defaultData;
  }
}
