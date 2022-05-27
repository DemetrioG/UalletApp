import * as React from "react";
import AuthRoutes from "./authRoutes";
import AppRoutes from "./appRoutes";
import { getStorage, removeAllStorage } from "../functions/storageData";
import { UserContext } from "../context/User/userContext";

export default function routes() {
  const { user, setUser } = React.useContext(UserContext);

  React.useEffect(() => {
    async function loadStorage() {
      const storageUser = await getStorage("authUser");

      // Parseia as datas para numero e compara se a data do storage está expirada
      if (
        Date.parse(storageUser?.date) >
        Date.parse(new Date(Date.now()).toString())
      ) {
        return setUser((userState) => ({
          ...userState,
          uid: storageUser.uid,
          signed: true,
        }));
      } else {
        return removeAllStorage();
      }
    }

    loadStorage();
  }, []);

  return user.signed ? <AppRoutes /> : <AuthRoutes />;
}
