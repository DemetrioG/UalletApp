import * as React from "react";

export interface IData {
  balance: string;
  isNetworkConnected: boolean | null;
}

export const initialDataState: IData = {
  balance: "R$ 0,00",
  isNetworkConnected: null,
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
