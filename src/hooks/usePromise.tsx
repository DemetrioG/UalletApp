import { useState } from "react";

export const usePromise = (promiseFn: (...args: any) => Promise<any>) => {
  const [isLoading, setIsLoading] = useState(false);

  const execute = async (...args: any) => {
    setIsLoading(true);
    try {
      await promiseFn(...args);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, handleExecute: execute };
};
