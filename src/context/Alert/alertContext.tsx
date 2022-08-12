import * as React from "react";

export interface IAlert {
  visibility?: boolean;
  type?: "success" | "error" | "confirm" | "network";
  title: string;
  helperText?: string;
  redirect?: string | null;
  callback?: boolean;
  callbackFunction?: Function;
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
