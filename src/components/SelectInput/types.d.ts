import { ISelectProps } from "native-base";

export interface SelectInputProps extends ISelectProps {
  options: { value: string; label: string }[];
}
