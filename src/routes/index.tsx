import { useEffect, useContext } from "react";
import NetInfo from "@react-native-community/netinfo";

import AuthRoutes from "./AuthRoutes";
import { UserContext } from "../context/User/userContext";
import { DataContext } from "../context/Data/dataContext";
import { AppStackRoutes } from "./AppStackRoutes";
import {
  useLoadStorage,
  useSetupNotifications,
  useUserIsAuthenticated,
  useUserIsExpired,
} from "./hooks/useAuthentications";
import { Checkout } from "../screens/App/Checkout";

const Routes = () => {
  const { setData } = useContext(DataContext);
  const { user } = useContext(UserContext);
  const {} = useUserIsAuthenticated();
  const {} = useSetupNotifications();
  const {} = useLoadStorage();
  const { expired } = useUserIsExpired();

  useEffect(() => {
    NetInfo.addEventListener(({ isConnected }) => {
      setData((dataState) => ({
        ...dataState,
        isNetworkConnected: isConnected,
      }));
    });
  }, []);

  if (expired) return <Checkout />;

  return user.signed ? <AppStackRoutes /> : <AuthRoutes />;
};

export default Routes;
