import { Checkbox } from "native-base";
import { Controller } from "react-hook-form";
import { FormCheckboxInputProps } from "./types";

export const FormCheckboxInput = (props: FormCheckboxInputProps) => {
  const { name, control, ...restProps } = props;
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { value, onChange } }) => (
        <Checkbox
          aria-label="checkbox"
          isChecked={value}
          onChange={onChange}
          value="checkbox"
          {...restProps}
        />
      )}
    />
  );
};
