import { useContext, useEffect, useState } from "react";
import { usePromise } from "../../hooks/usePromise";
import { getStorage, removeAllStorage } from "../../utils/storage.helper";
import { UserContext } from "../../context/User/userContext";
import { setupPushNotifications } from "../../utils/notification.helper";
import { DataContext } from "../../context/Data/dataContext";
import { fromUnixTime } from "date-fns";
import { authUser } from "../../utils/query.helper";
import { collection, doc, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../../services/firebase";

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
  const [subscription, setSubscription] = useState(false);
  const [expiredSubscription, setExpiredSubscription] = useState(false);
  const [expiredUser, setExpiredUser] = useState(false);

  let subscriptions: () => void;
  let activeSubscription: () => void;
  let userSnapshot: () => void;

  async function execute() {
    const user = await authUser();
    if (!user) return Promise.reject();

    const currentDate = new Date();

    subscriptions = onSnapshot(
      collection(db, "customers", user.uid, "subscriptions"),
      (snapshot) => {
        if (!snapshot.docs) return;
        const hasSubscription = snapshot.docs.length > 0;
        return setSubscription(hasSubscription);
      }
    );

    activeSubscription = onSnapshot(
      query(
        collection(db, "customers", user.uid, "subscriptions"),
        where("status", "==", "active"),
        where("current_period_end", ">=", currentDate)
      ),
      (snapshot) => {
        const hasExpiredSubscription = !Boolean(snapshot.size);
        return setExpiredSubscription(hasExpiredSubscription);
      }
    );

    userSnapshot = onSnapshot(doc(db, "users", user.uid), (snapshot) => {
      const expirationDate = snapshot.data()?.expirationDate;
      const hasExpiredUser = currentDate > fromUnixTime(expirationDate.seconds);
      return setExpiredUser(hasExpiredUser);
    });
  }

  useEffect(() => {
    execute();
    return () => {
      if (subscriptions) subscriptions();
      if (activeSubscription) activeSubscription();
      if (userSnapshot) userSnapshot();
    };
  }, []);

  return {
    subscription,
    expiredSubscription,
    expiredUser,
  };
};
