import { UseFormReturn } from "react-hook-form";
import { FormTextInputProps } from "../TextInput/types";

export interface FormTextInputCalendarProps extends FormTextInputProps {
  formMethods: UseFormReturn<T>;
  setDateOnOpen?: boolean;
}
