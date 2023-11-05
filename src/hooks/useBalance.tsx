import { useContext, useEffect } from "react";
import { BalanceProps, DataContext } from "../context/Data/dataContext";
import { currentUser } from "../utils/query.helper";
import { collection, doc, getDocs, onSnapshot } from "firebase/firestore";
import { db } from "../services/firebase";
import { useSelectedIsPastMonth } from "./useRefs";

export const useGetBalance = () => {
  const {
    data: { month, year, modality, trigger },
    setData,
  } = useContext(DataContext);
  const { isPast } = useSelectedIsPastMonth();

  let unsubscribe: () => void;

  async function execute() {
    if (!year) return;
    const user = await currentUser();
    if (!user) return "R$0,00";

    const getBalanceRef = !isPast && modality !== "Projetado";
    const balanceCollectionRef = collection(db, "balance", user.uid, modality);
    const collectionRef = getBalanceRef ? "balance" : `${month}_${year}`;
    const balanceDocRef = doc(balanceCollectionRef, collectionRef);

    unsubscribe = onSnapshot(balanceDocRef, async (snapshot) => {
      let data = snapshot.data();

      if (!data) {
        const accountSnapshot = await getDocs(
          collection(db, "accounts", user.uid, "accounts")
        );
        const accountData = accountSnapshot.docs.map((doc) => doc.data());
        data = accountData.map((i) => {
          return {
            [i.value]: {
              balance: 0,
            },
          };
        })[0];
      }

      const balanceSum = Object.values(data).reduce(
        (sum, { balance }) => sum + balance,
        0
      );
      return setData((rest) => ({
        ...rest,
        balance: { ...data, total: balanceSum } as BalanceProps,
      }));
    });
  }

  useEffect(() => {
    execute();
    return () => unsubscribe && unsubscribe();
  }, [month, year, modality, trigger]);

  return {};
};
