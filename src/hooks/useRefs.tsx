import { useContext } from "react";
import { DataContext } from "../context/Data/dataContext";

export const useSelectedIsPastMonth = () => {
  const { data } = useContext(DataContext);

  return {
    isPast: data.month < currentMonth && data.year <= currentYear,
  };
};

const currentMonth = new Date().getMonth() + 1;
const currentYear = new Date().getFullYear();
