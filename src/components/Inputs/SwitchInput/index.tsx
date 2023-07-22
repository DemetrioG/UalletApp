import { Controller } from "react-hook-form";
import { FormSwitchInputProps } from "./types";
import { Switch } from "native-base";

export const FormSwitchInput = (props: FormSwitchInputProps) => {
  const { control, name, ...restProps } = props;

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { value, onChange } }) => (
        <Switch value={value} onToggle={onChange} size="sm" {...restProps} />
      )}
    />
  );
};
