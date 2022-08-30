import firebase from "../../services/firebase";
import { sortObjectByKey } from "../../utils/array.helper";
import { getAtualDate, getFinalDateMonth } from "../../utils/date.helper";
import { currentUser } from "../../utils/query.helper";

type GetLastEntryProps = { month: number, year: number, modality: string };
export const getLastEntry = async ({ month, year, modality }: GetLastEntryProps) => {
  const user = await currentUser();

  if (!user) return Promise.reject(false);

  // Pega o mês de referência do App para realizar a busca dos registros
  const initialDate = new Date(`${month}/01/${year} 00:00:00`);
  const finalDate = new Date(
    `${month}/${getFinalDateMonth(month, year)}/${year
    } 23:59:59`
  );

  // Busca os registros dentro do período de referência
  await new Promise((resolve) => setInterval(resolve, 100));
  const snapshot = await firebase
    .firestore()
    .collection("entry")
    .doc(user.uid)
    .collection(modality)
    .where("date", ">=", initialDate)
    .where("date", "<=", finalDate)
    .orderBy("date", "desc")
    .limit(4)
    .get();

  if (snapshot.docs.length > 0) {
    const list: any = [];
    snapshot.forEach((result) => {
      list.push(result.data());
    });
    return sortObjectByKey(list, "id", "desc");
  }

  return [];
};

export const checkFutureDebitsToConsolidate = async () => {
  const [, initialDate, finalDate] = getAtualDate();
  const user = await currentUser();

  if (!user) return Promise.reject(false);

  return firebase
    .firestore()
    .collection("entry")
    .doc(user.uid)
    .collection("Projetado")
    .where("date", ">=", initialDate)
    .where("date", "<=", finalDate)
    .where("consolidated.wasActionShown", "==", false)
    .get()
}

export const completeUser = async () => {
  const user = await currentUser();

  if (!user) return Promise.reject(false);

  return firebase.firestore()
    .collection("users")
    .doc(user.uid)
    .get();
}