import { useState } from "react";

export const usePromise = <T extends any>(
  promiseFn: (...args: any) => Promise<T>
) => {
  const [isLoading, setIsLoading] = useState(false);

  const execute = async (...args: any): Promise<T> => {
    setIsLoading(true);
    try {
      const result = await promiseFn(...args);
      return result;
    } catch (error) {
      throw new Error(error as string);
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, handleExecute: execute };
};
