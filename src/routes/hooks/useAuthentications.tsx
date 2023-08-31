import { useContext, useEffect, useState } from "react";
import { usePromise } from "../../hooks/usePromise";
import { getStorage, removeAllStorage } from "../../utils/storage.helper";
import { UserContext } from "../../context/User/userContext";
import { setupPushNotifications } from "../../utils/notification.helper";
import { DataContext } from "../../context/Data/dataContext";
import { getUserData } from "../query";
import { fromUnixTime } from "date-fns";

export const useUserIsAuthenticated = () => {
  const { isLoading, handleExecute } = usePromise(execute);
  const { setUser } = useContext(UserContext);

  async function execute() {
    const storageUser = await getStorage("authUser");
    const storageDate = Date.parse(storageUser?.date);
    const today = Date.parse(new Date(Date.now()).toString());

    if (storageDate > today) {
      return setUser((userState) => ({
        ...userState,
        uid: storageUser.uid,
        signed: true,
      }));
    }

    return removeAllStorage();
  }

  useEffect(() => {
    handleExecute();
  }, []);

  return {
    isLoading,
  };
};

export const useLoadStorage = () => {
  const { isLoading, handleExecute } = usePromise(execute);
  const { setData } = useContext(DataContext);

  async function execute() {
    const storedMonth = await getStorage("Mês");
    const storedYear = await getStorage("Ano");

    return setData((rest) => ({
      ...rest,
      month: storedMonth ?? new Date().getMonth() + 1,
      year: storedYear ?? new Date().getFullYear(),
    }));
  }

  useEffect(() => {
    handleExecute();
  }, []);

  return {
    isLoading,
  };
};

export const useSetupNotifications = () => {
  const { isLoading, handleExecute } = usePromise(setupPushNotifications);
  const { setData } = useContext(DataContext);

  async function execute() {
    const token = await handleExecute();
    setData((state) => ({
      ...state,
      expoPushToken: token,
    }));
  }

  useEffect(() => {
    execute();
  }, []);

  return {
    isLoading,
  };
};

export const useUserIsExpired = () => {
  const { isLoading, handleExecute } = usePromise(getUserData);
  const [expired, setExpired] = useState(false);

  async function execute() {
    const data = await handleExecute();
    const currentDate = new Date();
    const expirationDate = fromUnixTime(data.seconds);
    return setExpired(currentDate > expirationDate);
  }

  useEffect(() => {
    execute();
  }, []);

  return {
    isLoading,
    expired,
  };
};
