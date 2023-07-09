import { useForm } from "react-hook-form";

export const useFilters = () => {
  const filterMethods = useForm();
  const values = filterMethods.watch();
  const hasFilter = Object.fromEntries(
    Object.entries(values).filter(
      ([key, value]) => value !== undefined && !!value
    )
  );

  return {
    filterMethods,
    filtered: hasFilter,
  };
};
