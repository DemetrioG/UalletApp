import { useContext, useState } from "react";
import { usePromise } from "../../../../hooks/usePromise";
import { getEntries } from "../querys";
import { DataContext } from "../../../../context/Data/dataContext";
import firebase from "../../../../services/firebase";

export const useGetEntries = () => {
  const { isLoading, handleExecute } = usePromise(getEntries);
  const { data } = useContext(DataContext);

  const [list, setList] = useState<firebase.firestore.DocumentData[]>([]);
  const [empty, setEmpty] = useState(false);

  async function execute() {
    const snapshot = await handleExecute(data);
    if (!snapshot.docs.length) return setEmpty(true);

    const list = snapshot.docs.map((doc) => doc.data());
    return setList(list);
  }

  return {
    isLoading,
    isEmpty: empty,
    data: list,
    handleGetData: execute,
  };
};
