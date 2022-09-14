import * as React from "react";

export interface IData {
  balance: string;
  equity: number;
  isNetworkConnected: boolean | null;
  month: number;
  year: number;
  modality: "Real" | "Projetado";
  expoPushToken: string | undefined;
}

export const initialDataState: IData = {
  balance: "R$ 0,00",
  equity: 0,
  isNetworkConnected: null,
  month: 0,
  year: 0,
  modality: "Real",
  expoPushToken: undefined,
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
