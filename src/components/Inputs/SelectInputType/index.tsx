import { FormSelectInput } from "../SelectInput";
import { FormSelectInputProps } from "../SelectInput/types";

export const FormSelectInputType = (
  props: Omit<FormSelectInputProps, "options">
) => {
  return (
    <FormSelectInput
      {...props}
      placeholder="Tipo do lançamento"
      options={typeOptions}
    />
  );
};

const typeOptions = [
  { value: "Receita", label: "Receita" },
  { value: "Despesa", label: "Despesa" },
];
