import { FetchableSelectInput } from "../FetchableSelectInput";
import { FetchableSelectInputTypes } from "../FetchableSelectInput/types";
import { useFetchable } from "./hooks/useFetchable";

export const FetchableSelectInputSharedAccounts = (
  props: Omit<FetchableSelectInputTypes, "fetchFn">
) => {
  return (
    <FetchableSelectInput
      placeholder="Conta"
      fetchFn={useFetchable}
      {...props}
    />
  );
};
