import firebase from "../../services/firebase";
import { getFinalDateMonth } from "../../utils/date.helper";

type GetLastEntryProps = { month: number, year: number, modality: string };
export const getLastEntry = async ({month, year, modality}: GetLastEntryProps) => {
  const user = firebase.auth().currentUser;

  if (!user) return Promise.reject(false);

  // Pega o mês de referência do App para realizar a busca dos registros
  const initialDate = new Date(`${month}/01/${year} 00:00:00`);
  const finalDate = new Date(
    `${month}/${getFinalDateMonth(month, year)}/${
      year
    } 23:59:59`
  );

  // Busca os registros dentro do período de referência
  await new Promise((resolve) => setInterval(resolve, 100));
  return firebase
    .firestore()
    .collection("entry")
    .doc(user.uid)
    .collection(modality)
    .where("date", ">=", initialDate)
    .where("date", "<=", finalDate)
    .orderBy("date", "desc")
    .limit(4)
    .get();
}