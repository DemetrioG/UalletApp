import { useContext, useState } from "react";
import { usePromise } from "../../../../hooks/usePromise";
import { getEntries } from "../querys";
import { DataContext } from "../../../../context/Data/dataContext";
import firebase from "../../../../services/firebase";
import { ListEntries, ListEntriesProps } from "../types";

export const useGetEntries = (props: ListEntriesProps) => {
  const { isLoading, handleExecute } = usePromise(getEntries);
  const { data } = useContext(DataContext);

  const [list, setList] = useState<ListEntries[]>([]);
  const [empty, setEmpty] = useState(false);

  async function execute() {
    const snapshot = await handleExecute({
      ...data,
      filters: props.server?.filters,
    });

    if (!snapshot.docs.length) setEmpty(true);

    const list = snapshot.docs.map((doc) => doc.data()) as ListEntries[];
    return setList(list);
  }

  return {
    isLoading,
    isEmpty: empty,
    data: list,
    handleGetData: execute,
  };
};
