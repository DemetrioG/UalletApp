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
} from "./hooks/useAuthentications";

const Routes = () => {
  const { setData } = useContext(DataContext);
  const { user } = useContext(UserContext);
  const {} = useUserIsAuthenticated();
  const {} = useSetupNotifications();
  const {} = useLoadStorage();

  useEffect(() => {
    NetInfo.addEventListener(({ isConnected }) => {
      setData((dataState) => ({
        ...dataState,
        isNetworkConnected: isConnected,
      }));
    });
  }, []);

  return user.signed ? <AppStackRoutes /> : <AuthRoutes />;
};

export default Routes;
