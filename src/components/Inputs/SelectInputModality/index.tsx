import { FormSelectInput } from "../SelectInput";
import { FormSelectInputProps } from "../SelectInput/types";

export const FormSelectInputModality = (
  props: Omit<FormSelectInputProps, "options">
) => {
  return (
    <FormSelectInput
      {...props}
      placeholder="Modalidade"
      options={schemaOptions}
    />
  );
};

const schemaOptions = [
  { value: "Real", label: "Real" },
  { value: "Projetado", label: "Projetado" },
];
