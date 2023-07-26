import { useEffect, useState } from "react";
import { usePromise } from "../../../../hooks/usePromise";
import { listSegment } from "../query";
import { IOption } from "../../../../types/types";

export const useFetchable = () => {
  const { isLoading, handleExecute } = usePromise(listSegment);
  const [options, setOptions] = useState<IOption[] | null>(null);

  async function execute() {
    handleExecute()
      .then((data) => setOptions(data))
      .catch(() => setOptions(null));
  }

  useEffect(() => {
    execute();
  }, []);

  return {
    isLoading,
    options,
  };
};
