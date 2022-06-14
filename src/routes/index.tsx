import * as React from "react";
import AuthRoutes from "./authRoutes";
import AppRoutes from "./appRoutes";
import { UserContext } from "../context/User/userContext";
import { getStorage, removeAllStorage } from "../utils/storage.helper";

export default function routes() {
  const { user, setUser } = React.useContext(UserContext);

  React.useEffect(() => {
    async function loadStorage() {
      const storageUser = await getStorage("authUser");
      const storageDate = Date.parse(storageUser?.date);
      const today = Date.parse(new Date(Date.now()).toString());

      // Parseia as datas para numero e compara se a data do storage está expirada
      if (storageDate > today) {
        return setUser((userState) => ({
          ...userState,
          uid: storageUser.uid,
          signed: true,
        }));
      }

      return removeAllStorage();
    }

    loadStorage();
  }, []);

  return user.signed ? <AppRoutes /> : <AuthRoutes />;
}
