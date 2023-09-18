import { IOption } from "../../../types/types";
import { FormSelectInputProps, SelectInputProps } from "../SelectInput/types";

export interface FormFetchableSelectInputTypes
  extends Omit<FormSelectInputProps, "options"> {
  fetchFn: (...args: any) => {
    options: IOption[] | null;
    isLoading: boolean;
  };
}

export interface FetchableSelectInputTypes
  extends Omit<SelectInputProps, "options"> {
  fetchFn: (...args: any) => {
    options: IOption[] | null;
    isLoading: boolean;
  };
}
