import { ICheckboxProps } from "native-base";

export interface FormCheckboxInputProps extends Omit<ICheckboxProps, "value"> {
  name: string;
  control: Control<T>;
}
