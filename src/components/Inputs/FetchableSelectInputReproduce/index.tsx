import { FormFetchableSelectInput } from "../FetchableSelectInput";
import { FormFetchableSelectInputTypes } from "../FetchableSelectInput/types";
import { useFetchable } from "./hooks/useFetchable";

export const FormFetchableSelectInputReprocuce = (
  props: Omit<FormFetchableSelectInputTypes, "fetchFn">
) => {
  return (
    <FormFetchableSelectInput
      placeholder="Selecione o período"
      fetchFn={useFetchable}
      {...props}
    />
  );
};
