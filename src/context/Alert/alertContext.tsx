import * as React from "react";

interface IAlert {
  visibility: boolean;
  type: "success" | "error";
  title: string;
  redirect: string | null;
}

export const initialAlertState: IAlert = {
  visibility: false,
  type: "success",
  title: "",
  redirect: null,
};

export const AlertContext = React.createContext<{
  alert: IAlert;
  setAlert: React.Dispatch<React.SetStateAction<IAlert>>;
}>({
  alert: {
    ...initialAlertState,
  },
  setAlert: () => {},
});

export function AlertContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [alert, setAlert] = React.useState<IAlert>({
    ...initialAlertState,
  });

  return (
    <AlertContext.Provider value={{ alert, setAlert }}>
      {children}
    </AlertContext.Provider>
  );
}
