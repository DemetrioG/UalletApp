import firebase from "../services/firebase";
import { numberToReal } from "./number.helper";
import { getStorage } from "./storage.helper";

/**
 * Retorna os dados de autenticação do usuário logado
 */
export const currentUser = async () => {
  return firebase.auth().currentUser || (await getStorage("authUser"));
};

type TBalance = { month: number; year: number; modality: string };
/**
 * Dada a modalidade/mês retorna o saldo atual do usuário.
 */
export const getBalance = async ({ month, year, modality }: TBalance) => {
  const user = await currentUser();

  if (!user) return "R$ 0,00";

  const data = await firebase
    .firestore()
    .collection("balance")
    .doc(user.uid)
    .collection(modality)
    .doc(`${month}_${year}`)
    .get();

  const response = data.data();

  return response?.balance ? numberToReal(response?.balance || 0) : "R$ 0,00";
};

type UpdateCurrentBalanceProps = {
  modality: string;
  sumBalance: boolean;
  docDate: string;
  value: number;
};

/**
 * Atualiza o saldo atual no banco
 */
export const updateCurrentBalance = async ({
  modality,
  sumBalance,
  docDate,
  value,
}: UpdateCurrentBalanceProps) => {
  const user = await currentUser();

  if (!user) return Promise.resolve(false);

  let balance = 0;
  await firebase
    .firestore()
    .collection("balance")
    .doc(user.uid)
    .collection(modality!)
    .doc(docDate)
    .get()
    .then((v) => {
      balance = v.data()?.balance || 0;
    })
    .catch(() => Promise.reject(false));

  if (sumBalance) {
    balance += value;
  } else {
    balance -= value;
  }

  return await firebase
    .firestore()
    .collection("balance")
    .doc(user.uid)
    .collection(modality!)
    .doc(docDate)
    .set({
      balance: balance,
    })
    .then(() => Promise.resolve(true))
    .catch(() => Promise.resolve(false));
};

/**
 * Esta query é setada, pois caso contrário, o firebase criar a coleção como virtualizada, sendo assim, não é possível ter acesso à ela.
 */
export async function createCollection(collection: string) {
  const user = await currentUser();

  if (!user) return Promise.reject();

  return await firebase
    .firestore()
    .collection(collection)
    .doc(user.uid)
    .set({ created: true })
    .then(() => Promise.resolve())
    .catch(() => Promise.reject());
}
