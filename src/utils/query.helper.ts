import { addDoc, collection, doc, getDoc, setDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "../services/firebase";
import { numberToReal } from "./number.helper";
import { getStorage } from "./storage.helper";

/**
 * Retorna os dados de autenticação do usuário logado
 */
export const currentUser = async () => {
  const auth = getAuth();
  return auth.currentUser || (await getStorage("authUser"));
};

type TBalance = { month: number; year: number; modality: string };
/**
 * Dada a modalidade/mês retorna o saldo atual do usuário.
 */
export const getBalance = async ({ month, year, modality }: TBalance) => {
  const user = await currentUser();

  if (!user) return "R$0,00";

  const balanceCollectionRef = collection(db, "balance", user.uid, modality);
  const balanceDocRef = doc(balanceCollectionRef, `${month}_${year}`);

  try {
    const balanceSnapshot = await getDoc(balanceDocRef);
    const response = balanceSnapshot.data();

    return response?.balance ? numberToReal(response?.balance || 0) : "R$0,00";
  } catch (error) {
    return Promise.reject(error);
  }
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
  const balanceCollectionRef = collection(db, "balance", user.uid, modality!);
  const balanceDocRef = doc(balanceCollectionRef, docDate);

  try {
    const balanceSnapshot = await getDoc(balanceDocRef);
    balance = balanceSnapshot.data()?.balance || 0;
  } catch (error) {
    return Promise.reject(false);
  }

  if (sumBalance) {
    balance += value;
  } else {
    balance -= value;
  }

  try {
    await setDoc(balanceDocRef, { balance });
    return Promise.resolve(true);
  } catch (error) {
    return Promise.resolve(false);
  }
};

/**
 * Esta query é setada, pois caso contrário, o firebase criar a coleção como virtualizada, sendo assim, não é possível ter acesso à ela.
 */
export async function createCollection(collectionPath: string) {
  const user = await currentUser();
  if (!user) return Promise.reject();

  try {
    const newCollectionRef = collection(db, collectionPath);
    await addDoc(newCollectionRef, { created: true });
    return Promise.resolve();
  } catch (error) {
    return Promise.reject();
  }
}
