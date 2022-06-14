import * as React from "react";
import { getStorage } from "../../utils/storage.helper";

interface IUser {
  signed: boolean;
  complete: boolean;
  uid: string | undefined;
  name: string;
  hideNumbers: boolean;
}

export const initialUserState: IUser = {
  signed: false,
  complete: false,
  uid: undefined,
  name: "",
  hideNumbers: false,
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

  React.useEffect(() => {
    (async () => {
      const storedData = await getStorage("hideNumbers");
      setUser((userState) => ({
        ...userState,
        hideNumbers: storedData,
      }));
    })();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}
