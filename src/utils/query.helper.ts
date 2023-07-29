import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { auth, db } from "../services/firebase";
import { getStorage } from "./storage.helper";

/**
 * Retorna os dados de autenticação do usuário logado
 */
export const currentUser = async () => {
  return auth.currentUser || (await getStorage("authUser"));
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

export async function sleep(ms: number) {
  return await new Promise((resolve) => setInterval(resolve, ms));
}

export async function getRevenue(
  user: any,
  modality: "Real" | "Projetado",
  initialDate: Date,
  finalDate: Date
) {
  const queryRef = collection(db, "entry", user.uid, modality);
  const querySnapshot = await getDocs(
    query(
      queryRef,
      where("date", ">=", initialDate),
      where("date", "<=", finalDate),
      where("type", "==", "Receita")
    )
  );

  return querySnapshot.docs.reduce(
    (acc, doc) => acc + (doc.data().value || 0),
    0
  );
}
