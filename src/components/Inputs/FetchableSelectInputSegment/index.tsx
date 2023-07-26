import { FormFetchableSelectInput } from "../FetchableSelectInput";
import { FormFetchableSelectInputTypes } from "../FetchableSelectInput/types";
import { useFetchable } from "./hooks/useFetchable";

export const FormFetchableSelectInputSegment = (
  props: Omit<FormFetchableSelectInputTypes, "fetchFn">
) => {
  return (
    <FormFetchableSelectInput
      placeholder="Segmento"
      fetchFn={useFetchable}
      {...props}
    />
  );
};
