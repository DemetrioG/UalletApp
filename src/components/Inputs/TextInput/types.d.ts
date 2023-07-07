import { IInputProps } from "native-base";
import { Control, FieldError, FieldErrors, FieldValues } from "react-hook-form";
import {
  TextInputMaskOptionProp,
  TextInputMaskTypeProp,
} from "react-native-masked-text";

export interface TextInputProps extends Omit<IInputProps, "textAlign"> {
  masked?: TextInputMaskTypeProp;
  errors?: FieldErrors | FieldError;
  helperText?: string | undefined;
  withIcon?: boolean;
  options?: TextInputMaskOptionProp;
  setCalendar?: () => void;
  customTextInputProps?: object;
}

export interface FormTextInputProps extends TextInputProps {
  name: string;
  control: Control<T>;
}
