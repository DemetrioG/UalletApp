import { useContext, useEffect } from "react";
import { DataContext } from "../context/Data/dataContext";
import { currentUser } from "../utils/query.helper";
import { collection, doc, onSnapshot } from "firebase/firestore";
import { db } from "../services/firebase";
import { numberToReal } from "../utils/number.helper";

export const useGetBalance = () => {
  const {
    data: { month, year, modality },
    setData,
  } = useContext(DataContext);

  let unsubscribe: () => void;

  async function execute() {
    if (!year) return;
    const user = await currentUser();
    if (!user) return "R$0,00";

    const balanceCollectionRef = collection(db, "balance", user.uid, modality);
    const collectionRef = modality === "Real" ? "balance" : `${month}_${year}`;
    const balanceDocRef = doc(balanceCollectionRef, collectionRef);

    unsubscribe = onSnapshot(balanceDocRef, (snapshot) => {
      const data = snapshot.data();
      const balanceSum = data
        ? Object.values(data).reduce((sum, { balance }) => sum + balance, 0)
        : 0;
      const balance = numberToReal(balanceSum);
      return setData((rest) => ({
        ...rest,
        balance,
      }));
    });
  }

  useEffect(() => {
    execute();
    return () => unsubscribe && unsubscribe();
  }, [month, year, modality]);

  return {};
};
