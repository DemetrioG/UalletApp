import * as React from "react";

interface IUser {
  signed: boolean;
  complete: boolean;
  uid: string | undefined;
  name: string;
}

export const initialUserState: IUser = {
  signed: false,
  complete: false,
  uid: undefined,
  name: "",
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

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}
