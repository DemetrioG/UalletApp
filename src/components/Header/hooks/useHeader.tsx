import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../context/User/userContext";
import { usePromise } from "../../../hooks/usePromise";
import { getData, getRevenueGrowth } from "../query";
import { DataContext } from "../../../context/Data/dataContext";

export const useGetData = () => {
  const { user, setUser } = useContext(UserContext);
  const { handleExecute } = usePromise(getData);

  async function execute() {
    if (user.name) return;
    handleExecute().then((data) =>
      setUser((rest) => ({
        ...rest,
        name: data.name,
        completeName: data.completeName,
        email: data.email,
      }))
    );
  }

  useEffect(() => {
    execute();
  }, []);

  return {};
};

export const useGetRevenue = () => {
  const { isLoading, handleExecute } = usePromise(getRevenueGrowth);
  const {
    data: { modality, month, year, trigger },
  } = useContext(DataContext);
  const [data, setData] = useState(0);

  async function execute() {
    handleExecute({ modality, month, year }).then(setData);
  }

  useEffect(() => {
    if (!year) return;
    execute();
  }, [month, year, modality, trigger]);

  return {
    isLoading,
    handleExecute: execute,
    data,
  };
};
