import { useForm } from "react-hook-form";

export function useFilters<T>() {
  const filterMethods = useForm();
  const values = filterMethods.watch();
  const serverFilters = getFilters(values["server"]);
  const clientFilters = getFilters(values["client"]);

  const hasFilter =
    ((clientFilters &&
      Object.values(clientFilters).some((value) => {
        console.log(value);
        return value !== undefined;
      })) ||
      (serverFilters &&
        Object.values(serverFilters).some((value) => value !== undefined))) ??
    false;

  function clientFn(row: T) {
    const filters = getFilters(values["client"]);
    if (!filters) return true;
    const keys = Object.keys(filters);

    return keys.every((key) => {
      const currentFilter = removeAccents(filters[key]);
      const currentValue = removeAccents(row[key as keyof T] as string);
      return currentValue.includes(currentFilter);
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
