import { useEffect, useState } from "react";
import { usePromise } from "../../../../hooks/usePromise";
import { getPrice, sendPaymentIntent } from "../query";

export const useGetPrice = () => {
  const { isLoading, handleExecute } = usePromise(getPrice);
  const [data, setData] = useState(0);

  async function execute() {
    const price = await handleExecute();
    return setData(price);
  }

  useEffect(() => {
    execute();
  }, []);

  return {
    isLoading,
    data,
  };
};

export const useGetUrl = () => {
  const { isLoading, handleExecute } = usePromise(sendPaymentIntent);
  const [url, setUrl] = useState("");

  async function execute() {
    const url = await handleExecute();
    return setUrl(url);
  }

  useEffect(() => {
    execute();
  }, []);

  return {
    isLoadingUrl: isLoading,
    url,
  };
};
