import * as React from "react";
import NetInfo from "@react-native-community/netinfo";

import AuthRoutes from "./AuthRoutes";
import AppRoutes from "./AppTabRoutes";
import { UserContext } from "../context/User/userContext";
import { DataContext } from "../context/Data/dataContext";
import { getStorage, removeAllStorage } from "../utils/storage.helper";

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

  React.useEffect(() => {
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
