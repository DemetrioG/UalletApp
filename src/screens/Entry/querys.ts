import firebase from "../../services/firebase";
import { getFinalDateMonth } from "../../utils/date.helper";

/**
 * Dada a modalidade/mês retorna o saldo atual do usuário.
 */
type TBalance = { month: string, modality: string }
export const getBalance = async ({ month, modality }: TBalance) => {
  const user = firebase.auth().currentUser;

  if (!user) return { balance: 0 };

  const data = await firebase
    .firestore()
    .collection("balance").doc(user.uid)
    .collection(modality).doc(month)
    .get();

  return data.data() as { balance: number };
}

type TEntryList = { month: number, year: number, modality: string }
export const getEntryList = async ({ month, year, modality } : TEntryList) => {
  const user = firebase.auth().currentUser;
  if (!user) return Promise.reject(null);

  const initialDate = new Date(`${month}/01/${year} 00:00:00`);
  const finalDate = new Date(
    `${month}/${getFinalDateMonth(month, year)}/${year
    } 23:59:59`
  );

  return firebase
    .firestore()
    .collection("entry")
    .doc(user.uid)
    .collection(modality)
    .where("date", ">=", initialDate)
    .where("date", "<=", finalDate)
    .orderBy("date", "desc")
    .get();
}