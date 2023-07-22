import { ISwitchProps } from "native-base";
import { Control } from "react-hook-form";

export interface FormSwitchInputProps extends ISwitchProps {
  name: string;
  control: Control<T>;
}
