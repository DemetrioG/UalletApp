import * as React from "react";
import { getStorage, setStorage } from "../../utils/storage.helper";

interface IUser {
  signed: boolean;
  complete: boolean;
  uid: string | undefined;
  name: string;
  hideNumbers: boolean;
  hideAssetPosition: boolean;
  completeName: string | undefined;
  email: string | undefined;
}

export const initialUserState: IUser = {
  signed: false,
  complete: false,
  uid: undefined,
  name: "",
  hideNumbers: false,
  hideAssetPosition: true,
  completeName: undefined,
  email: undefined,
};

export const UserContext = React.createContext<{
  user: IUser;
  setUser: React.Dispatch<React.SetStateAction<IUser>>;
}>({
  user: {
    ...initialUserState,
  },
  setUser: () => {},
});

export function UserContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = React.useState<IUser>({
    ...initialUserState,
  });

  const notInitialRender = React.useRef(false);

  /**
   * Retorna os dados do usuário cacheados
   */
  async function loadCache() {
    const storedData = await getStorage("user");
    setUser((userState) => ({
      ...userState,
      name: storedData?.name || initialUserState.name,
      hideNumbers: storedData?.hideNumbers || initialUserState.hideNumbers,
      hideAssetPosition:
        storedData?.hideAssetPosition || initialUserState.hideAssetPosition,
      completeName: storedData?.completeName,
      email: storedData?.email,
    }));
  }

  React.useEffect(() => {
    loadCache();
  }, []);

  React.useEffect(() => {
    if (notInitialRender.current) {
      const data = {
        name: user.name,
        hideNumbers: user.hideNumbers,
        hideAssetPosition: user.hideAssetPosition,
        completeName: user.completeName,
        email: user.email,
      };
      setStorage("user", data);
    } else {
      notInitialRender.current = true;
    }
  }, [user]);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}
