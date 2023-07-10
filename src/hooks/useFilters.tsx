import { useForm } from "react-hook-form";

export const useFilters = <T extends any>() => {
  const filterMethods = useForm();
  const values = filterMethods.watch();
  return {
    filterMethods,
    clientFilters: getFilters(values["client"]),
    serverFilters: getFilters(values["server"]),
  };
};

function getFilters(obj?: { [key: string]: string | number }) {
  if (!obj) return;
  return Object.entries(obj).reduce((acc, [key, value]) => {
    if (value !== undefined) {
      acc[key] = value;
    }
    return acc;
  }, {} as { [key: string]: string | number });
}
