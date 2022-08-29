import firebase from "../services/firebase";
import { numberToReal } from "./number.helper";

export const currentUser = () => {
  return firebase.auth().currentUser;
}

/**
 * Dada a modalidade/mês retorna o saldo atual do usuário.
 */
 type TBalance = { month: string, modality: string }
 export const getBalance = async ({ month, modality }: TBalance) => {
   const user = currentUser();
 
   if (!user) return "R$ 0,00";
 
   const data = await firebase
     .firestore()
     .collection("balance").doc(user.uid)
     .collection(modality).doc(month)
     .get();
 
   const { balance } = data.data() as { balance: number };
 
   return balance ? numberToReal(balance) : "R$ 0,00";
 }