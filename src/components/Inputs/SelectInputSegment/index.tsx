import { FormSelectInput } from "../SelectInput";
import { FormSelectInputProps } from "../SelectInput/types";

export const FormSelectInputSegment = (
  props: Omit<FormSelectInputProps, "options">
) => {
  return (
    <FormSelectInput
      {...props}
      placeholder="Segmento"
      options={segmentOptions}
    />
  );
};

const segmentOptions = [
  { value: "Lazer", label: "Lazer" },
  { value: "Educação", label: "Educação" },
  { value: "Investimentos", label: "Investimentos" },
  { value: "Necessidades", label: "Necessidades" },
  { value: "Curto e médio prazo", label: "Curto e médio prazo" },
];
