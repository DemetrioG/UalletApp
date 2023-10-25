import { useForm } from "react-hook-form";
import { realToNumber } from "../utils/number.helper";

export function useFilters<T>(defaultValues?: { client?: any; server?: any }) {
  const filterMethods = useForm({
    defaultValues,
  });
  const values = filterMethods.watch();
  const serverFilters = getFilters(values["server"]);
  const clientFilters = getFilters(values["client"]);

  const hasFilter =
    ((clientFilters &&
      Object.values(clientFilters).some(
        (value) => !!value && value !== undefined
      )) ||
      (serverFilters &&
        Object.values(serverFilters).some(
          (value) => !!value && value !== undefined
        ))) ??
    false;

  function clientFn(row: T) {
    const filters = getFilters(values["client"]);
    if (!filters) return true;
    const keys = Object.keys(filters);

    return keys.every((key) => {
      const currentFilter = filters[key];
      const currentValue = row[key as keyof T] as string;
      if (!currentFilter) return true;

      if (key.includes("initial_value")) {
        return Number(row["value" as keyof T]) >= realToNumber(currentFilter);
      }

      if (key.includes("final_value")) {
        return Number(row["value" as keyof T]) <= realToNumber(currentFilter);
      }

      return removeAccents(currentValue).includes(removeAccents(currentFilter));
    });
  }

  return {
    filterMethods,
    clientFilters: clientFn,
    serverFilters,
    hasFilter,
  };
}

function getFilters(obj?: { [key: string]: string }) {
  if (!obj) return;
  return Object.entries(obj).reduce((acc, [key, value]) => {
    if (value !== undefined) {
      acc[key] = value;
    }
    return acc;
  }, {} as { [key: string]: string });
}

function removeAccents(param: string) {
  return param
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}
