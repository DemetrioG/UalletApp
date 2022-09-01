import firebase from "../services/firebase";
import { numberToReal } from "./number.helper";
import { getStorage } from "./storage.helper";

/**
 * Retorna os dados de autenticação do usuário logado
 */
export const currentUser = async () => {
  return firebase.auth().currentUser || (await getStorage("authUser"));
};

type TBalance = { month: string; modality: string };
/**
 * Dada a modalidade/mês retorna o saldo atual do usuário.
 */
export const getBalance = async ({ month, modality }: TBalance) => {
  const user = await currentUser();

  if (!user) return "R$ 0,00";

  const data = await firebase
    .firestore()
    .collection("balance")
    .doc(user.uid)
    .collection(modality)
    .doc(month)
    .get();

  const response = data.data();

  return response?.balance ? numberToReal(response?.balance || 0) : "R$ 0,00";
};
