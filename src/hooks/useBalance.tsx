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
    const balanceDocRef = doc(balanceCollectionRef, `${month}_${year}`);

    unsubscribe = onSnapshot(balanceDocRef, (snapshot) => {
      const data = snapshot.data();
      const balance = data?.balance
        ? numberToReal(data?.balance || 0)
        : "R$0,00";
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
