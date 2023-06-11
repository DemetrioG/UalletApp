import * as React from "react";
import NetInfo from "@react-native-community/netinfo";

import AuthRoutes from "./AuthRoutes";
import AppRoutes from "./AppTabRoutes";
import { UserContext } from "@context/User/userContext";
import { DataContext } from "@context/Data/dataContext";
import { getStorage, removeAllStorage } from "@utils/storage.helper";
import { setupPushNotifications } from "@utils/notification.helper";

const Routes = () => {
  const { setData } = React.useContext(DataContext);
  const { user, setUser } = React.useContext(UserContext);

  /**
   * Checa se a autenticação está expirada
   */
  async function userIsAuthenticated() {
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

  async function setupNotifications() {
    await setupPushNotifications().then((token) => {
      setData((state) => ({
        ...state,
        expoPushToken: token,
      }));
    });
  }

  React.useEffect(() => {
    setupNotifications();
    userIsAuthenticated();
    NetInfo.addEventListener(({ isConnected }) => {
      setData((dataState) => ({
        ...dataState,
        isNetworkConnected: isConnected,
      }));
    });
  }, []);

  return user.signed ? <AppRoutes /> : <AuthRoutes />;
};

export default Routes;
