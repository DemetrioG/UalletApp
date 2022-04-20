import * as React from "react";
import { useStateCallback } from "../../functions";

interface IDate {
  month: number | null;
  year: number | null;
  modality: "Real" | "Projetado";
}

export const initialDateState: IDate = {
  month: null,
  year: null,
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
  const [date, setDate] = useStateCallback({
    ...initialDateState,
  });

  return (
    <DateContext.Provider value={{ date, setDate }}>
      {children}
    </DateContext.Provider>
  );
}
