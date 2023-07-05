import { ISelectProps } from "native-base";
import { Control, FieldValues } from "react-hook-form";

export interface SelectInputProps extends ISelectProps {
  options: { value: string; label: string }[];
  isRequired?: boolean;
}

export interface FormSelectInputProps extends SelectInputProps {
  name: string;
  control: Control<T>;
}
