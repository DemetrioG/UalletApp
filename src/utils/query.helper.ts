import firebase from "../services/firebase";
import { numberToReal } from "./number.helper";
import { getStorage } from "./storage.helper";

export const currentUser = async () => {
  return firebase.auth().currentUser || (await getStorage("user"));
}

/**
 * Dada a modalidade/mês retorna o saldo atual do usuário.
 */
 type TBalance = { month: string, modality: string }
 export const getBalance = async ({ month, modality }: TBalance) => {
   const user = await currentUser();
 
   if (!user) return "R$ 0,00";
 
   const data = await firebase
     .firestore()
     .collection("balance").doc(user.uid)
     .collection(modality).doc(month)
     .get();
 
   const { balance } = data.data() as { balance: number };
 
   return balance ? numberToReal(balance) : "R$ 0,00";
 }