import { FormProvider } from "react-hook-form";
import { DeleteAccountForm } from "./Form";
import { useFormDeleteAccount } from "./hooks/useDeleteAccount";

export const DeleteAccountScreen = () => {
  const { formMethods } = useFormDeleteAccount();

  return (
    <FormProvider {...formMethods}>
      <DeleteAccountForm />
    </FormProvider>
  );
};
