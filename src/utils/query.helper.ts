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
  modality: "Real" | "Projetado";
  sumBalance: boolean;
  docDate: string;
  value: number;
  account: string;
};

/**
 * Atualiza o saldo atual no banco
 */
export const updateCurrentBalance = async ({
  modality,
  sumBalance,
  docDate,
  value,
  account,
}: UpdateCurrentBalanceProps) => {
  const user = await currentUser();
  if (!user) return Promise.resolve(false);
  const balanceCollectionRef = collection(db, "balance", user.uid, modality);
  const balanceDocRef = doc(
    balanceCollectionRef,
    modality === "Projetado" ? docDate : "balance"
  );

  try {
    const balanceSnapshot = await getDoc(balanceDocRef);
    const balanceData = balanceSnapshot.data();
    const balance = balanceData?.[account]?.balance || 0;

    if (sumBalance) {
      await setDoc(balanceDocRef, {
        ...balanceData,
        [account]: { balance: balance + value },
      });
    } else {
      await setDoc(balanceDocRef, {
        ...balanceData,
        [account]: { balance: balance - value },
      });
    }

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

export async function getExpense(
  user: any,
  modality: "Real" | "Projetado",
  initialDate: Date,
  finalDate: Date,
  segment?: string
) {
  const queryRef = collection(db, "entry", user.uid, modality);

  const queryConstraints = [
    where("date", ">=", initialDate),
    where("date", "<=", finalDate),
    where("type", "==", "Despesa"),
  ];

  if (segment) {
    queryConstraints.push(where("segment", "==", segment));
  }

  const querySnapshot = await getDocs(query(queryRef, ...queryConstraints));

  return querySnapshot.docs.reduce(
    (acc, doc) => acc + (doc.data().value || 0),
    0
  );
}
