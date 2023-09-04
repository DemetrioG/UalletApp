import { useEffect, useState } from "react";
import { usePromise } from "../../../../../hooks/usePromise";
import { getPlans } from "../query";

export const usePlans = () => {
  const { isLoading, handleExecute } = usePromise(getPlans);
  const [plans, setPlans] = useState<any[]>([]);

  async function execute() {
    const plans = await handleExecute();
    return setPlans(plans);
  }

  useEffect(() => {
    execute();
  }, []);

  return {
    isLoading,
    plans,
  };
};
