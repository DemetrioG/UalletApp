import firebase from "firebase";

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

  return data.data() as {balance: number};
}