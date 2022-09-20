import * as React from "react";

interface ILoader {
  balance?: boolean;
  lineChart?: boolean;
  entrySegmentChart?: boolean;
  name?: boolean;
  homeVisible?: boolean;
  equity?: boolean;
  positions?: boolean;
  assetSegmentChart?: boolean;
  investVisible?: boolean;
}

export const initialLoaderState: ILoader = {
  balance: false,
  lineChart: false,
  entrySegmentChart: false,
  name: false,
  homeVisible: true,
  equity: false,
  positions: false,
  assetSegmentChart: false,
  investVisible: true,
};

export const LoaderContext = React.createContext<{
  loader: ILoader;
  setLoader: React.Dispatch<React.SetStateAction<ILoader>>;
}>({
  loader: {
    ...initialLoaderState,
  },
  setLoader: () => {},
});

export function LoaderContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loader, setLoader] = React.useState<ILoader>({
    ...initialLoaderState,
  });

  return (
    <LoaderContext.Provider value={{ loader, setLoader }}>
      {children}
    </LoaderContext.Provider>
  );
}
