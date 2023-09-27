import { useEffect, useState } from "react";
import { usePromise } from "../../../../../hooks/usePromise";
import { listLinkedAccountsSharedWithYou } from "../../../Configurations/LinkedAccount/query";

export const useHasLinked = () => {
  const { handleExecute } = usePromise(listLinkedAccountsSharedWithYou);
  const [hasLinked, setHasLinked] = useState(false);

  async function execute() {
    const data = await handleExecute();
    setHasLinked(data.length > 0);
  }

  useEffect(() => {
    execute();
  }, []);

  return {
    hasLinked,
  };
};
