import * as React from "react";

export interface BalanceProps {
  carteira: {
    balance: number;
  };
  total: number;
  [key: string]: any;
}

export interface IData {
  balance: BalanceProps;
  isNetworkConnected: boolean | null;
  month: number;
  year: number;
  modality: "Real" | "Projetado";
  expoPushToken: string | undefined;
  trigger: number;
}

export const initialDataState: IData = {
  balance: {
    carteira: {
      balance: 0,
    },
    total: 0,
  },
  isNetworkConnected: null,
  month: 0,
  year: 0,
  modality: "Real",
  expoPushToken: undefined,
  trigger: 0,
};

export const DataContext = React.createContext<{
  data: IData;
  setData: React.Dispatch<React.SetStateAction<IData>>;
}>({
  data: {
    ...initialDataState,
  },
  setData: () => {},
});

export function DataContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [data, setData] = React.useState<IData>({
    ...initialDataState,
  });

  return (
    <DataContext.Provider value={{ data, setData }}>
      {children}
    </DataContext.Provider>
  );
}
