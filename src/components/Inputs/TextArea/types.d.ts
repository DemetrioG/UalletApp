import { ITextAreaProps } from "native-base";

export interface TextAreaProps extends Omit<ITextAreaProps, "textAlign"> {
  errors?: FieldErrors | FieldError;
  helperText?: string | undefined;
}

export interface FormTextAreaProps extends TextAreaProps {
  name: string;
  control: Control<T>;
}
