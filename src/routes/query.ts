import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { currentUser } from "../utils/query.helper";
import { db } from "../services/firebase";
import { fromUnixTime } from "date-fns";

export async function getUserData() {
  const user = await currentUser();
  if (!user) return Promise.reject();

  const currentDate = new Date();

  const subscriptions = await getDocs(
    collection(db, "customers", user.uid, "subscriptions")
  );
  const hasSubscription = subscriptions.docs.length > 0;

  if (hasSubscription) {
    const activeSubscription = await getDocs(
      query(
        collection(db, "customers", user.uid, "subscriptions"),
        where("status", "==", "active"),
        where("current_period_end", ">=", currentDate)
      )
    );
    return !Boolean(activeSubscription.size);
  } else {
    const userSnapshot = await getDoc(doc(db, "users", user.uid));
    const expirationDate = userSnapshot.data()?.expirationDate;
    return currentDate > fromUnixTime(expirationDate.seconds);
  }
}
