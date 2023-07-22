import { FormSelectInput } from "../SelectInput";
import { FormSelectInputProps } from "../SelectInput/types";

export const FormSelectInputMonthQuantity = (
  props: Omit<FormSelectInputProps, "options">
) => {
  return <FormSelectInput {...props} placeholder="Meses" options={options} />;
};

const options = Array.from({ length: 12 }, (_, index) => ({
  value: (index + 1).toString(),
  label: (index + 1).toString(),
}));
