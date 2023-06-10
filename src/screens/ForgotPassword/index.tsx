import { FormProvider } from "react-hook-form";
import { ForgotPasswordForm } from "./Form";
import { useFormForgotPassword } from "./hooks/useForgotPassword";

export const ForgotPassword = () => {
  const { formMethods } = useFormForgotPassword();
  return (
    <FormProvider {...formMethods}>
      <ForgotPasswordForm />
    </FormProvider>
  );
};
