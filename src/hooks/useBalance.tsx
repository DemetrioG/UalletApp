import { useContext, useEffect } from "react";
import { BalanceProps, DataContext } from "../context/Data/dataContext";
import { currentUser } from "../utils/query.helper";
import { collection, doc, onSnapshot } from "firebase/firestore";
import { db } from "../services/firebase";

export const useGetBalance = () => {
  const {
    data: { month, year, modality, trigger },
    setData,
  } = useContext(DataContext);

  let unsubscribe: () => void;

  async function execute() {
    if (!year) return;
    const user = await currentUser();
    console.log(user?.uid);
    if (!user) return "R$0,00";

    const balanceCollectionRef = collection(db, "balance", user.uid, modality);
    const collectionRef = modality === "Real" ? "balance" : `${month}_${year}`;
    const balanceDocRef = doc(balanceCollectionRef, collectionRef);

    unsubscribe = onSnapshot(balanceDocRef, (snapshot) => {
      const data = snapshot.data();
      if (!data) return;

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
