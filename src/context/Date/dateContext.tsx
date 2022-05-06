import * as React from "react";

export interface IDate {
  month: number;
  year: number;
  modality: "Real" | "Projetado";
}

export const initialDateState: IDate = {
  month: 0,
  year: 0,
  modality: "Real",
};

export const DateContext = React.createContext<{
  date: IDate;
  setDate: React.Dispatch<React.SetStateAction<IDate>>;
}>({
  date: {
    ...initialDateState,
  },
  setDate: () => {},
});

export function DateContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [date, setDate] = React.useState<IDate>({
    ...initialDateState,
  });

  return (
    <DateContext.Provider value={{ date, setDate }}>
      {children}
    </DateContext.Provider>
  );
}
