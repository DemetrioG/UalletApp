import * as React from "react";

export interface IConfirm {
  visibility?: boolean;
  title: string;
  redirect?: string | null;
  callback?: boolean;
  callbackFunction?: Function;
}

export const initialConfirmState: IConfirm = {
  visibility: false,
  title: "",
  redirect: null,
};

export const ConfirmContext = React.createContext<{
  confirm: IConfirm;
  setConfirm: React.Dispatch<React.SetStateAction<IConfirm>>;
}>({
  confirm: {
    ...initialConfirmState,
  },
  setConfirm: () => {},
});

export function ConfirmContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [confirm, setConfirm] = React.useState<IConfirm>({
    ...initialConfirmState,
  });

  return (
    <ConfirmContext.Provider value={{ confirm, setConfirm }}>
      {children}
    </ConfirmContext.Provider>
  );
}
