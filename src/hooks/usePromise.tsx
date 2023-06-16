import { useState } from "react";

export const usePromise = <T extends any>(
  promiseFn: (...args: any) => Promise<T>
) => {
  const [isLoading, setIsLoading] = useState(false);

  const execute = async (...args: any): Promise<T> => {
    setIsLoading(true);
    try {
      const result = await promiseFn(...args);
      setIsLoading(false);
      return result;
    } catch (error) {
      setIsLoading(false);
      throw new Error(error as string);
    }
  };

  return { isLoading, handleExecute: execute };
};
