import { doc, getDoc } from "firebase/firestore";
import { authUser, currentUser, getRevenue } from "../../utils/query.helper";
import { db } from "../../services/firebase";
import { getMonthDate } from "../../utils/date.helper";

interface GetRevenueProps {
  modality: "Real" | "Projetado";
  month: number;
  year: number;
}

export async function getData() {
  const user = await authUser();

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

export async function getRevenueGrowth({
  modality,
  month,
  year,
}: GetRevenueProps) {
  const user = await currentUser();
  if (!user) return Promise.reject(false);

  const [initialPastDate, finalPastDate] = getMonthDate(month - 1, year);
  const [initialDate, finalDate] = getMonthDate(month, year);

  const [pastRevenue, currentRevenue] = await Promise.all([
    getRevenue(user, modality, initialPastDate, finalPastDate),
    getRevenue(user, modality, initialDate, finalDate),
  ]);

  if (!pastRevenue) return currentRevenue;
  return ((currentRevenue - pastRevenue) / pastRevenue) * 100;
}
