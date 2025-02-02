import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../../services/firebase";
import { getAtualDate, getMonthDate } from "../../../utils/date.helper";
import { authUser, currentUser, sleep } from "../../../utils/query.helper";

type GetLastEntryProps = { month: number; year: number; modality: string };
/**
 * Retorna os últimos lançamentos financeiros no app
 */
export const getLastEntry = async ({
  month,
  year,
  modality,
}: GetLastEntryProps) => {
  const user = await currentUser();
  if (!user) return Promise.reject(false);

  const [initialDate, finalDate] = getMonthDate(month, year);

  await sleep(100);
  const snapshot = await getDocs(
    query(
      collection(doc(collection(db, "entry"), user.uid), modality),
      where("date", ">=", initialDate),
      where("date", "<=", finalDate),
      orderBy("date", "desc"),
      orderBy("id", "desc"),
      limit(4)
    )
  );

  return snapshot.docs.map((result) => result.data()) ?? [];
};

/**
 * Verifica se há despesas projetadas para consolidar na data atual
 */
export const checkFutureDebitsToConsolidate = async () => {
  const [initialDate, finalDate] = getAtualDate();
  const user = await currentUser();
  if (!user) return Promise.reject(false);

  return getDocs(
    query(
      collection(doc(collection(db, "entry"), user.uid), "Projetado"),
      where("date", ">=", initialDate),
      where("date", "<=", finalDate),
      where("consolidated.wasActionShown", "==", false)
    )
  );
};

export const completeUser = async () => {
  const user = await authUser();
  if (!user) return Promise.reject(false);

  return getDoc(doc(collection(db, "users"), user.uid));
};
