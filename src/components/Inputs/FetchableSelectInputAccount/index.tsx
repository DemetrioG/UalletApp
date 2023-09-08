import { FormFetchableSelectInput } from "../FetchableSelectInput";
import { FormFetchableSelectInputTypes } from "../FetchableSelectInput/types";
import { useFetchable } from "./hooks/useFetchable";

export const FormFetchableSelectInputAccount = (
  props: Omit<FormFetchableSelectInputTypes, "fetchFn">
) => {
  return (
    <FormFetchableSelectInput
      placeholder="Conta"
      fetchFn={useFetchable}
      {...props}
    />
  );
};
