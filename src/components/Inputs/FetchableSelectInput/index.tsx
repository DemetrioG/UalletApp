import { Controller } from "react-hook-form";
import { FormFetchableSelectInputTypes } from "./types";
import { SelectInput } from "../SelectInput";

export const FormFetchableSelectInput = (
  props: FormFetchableSelectInputTypes
) => {
  const { name, control, placeholder, ...restProps } = props;
  const { options, isLoading } = props.fetchFn();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { value, onChange } }) => (
        <SelectInput
          isDisabled={isLoading}
          placeholder={isLoading ? "Carregando..." : placeholder}
          selectedValue={value}
          onValueChange={onChange}
          options={options ?? []}
          {...restProps}
        />
      )}
    />
  );
};
