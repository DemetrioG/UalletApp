import { FormProvider } from "react-hook-form";
import ForgotPasswordForm from "./Form";
import { useFormForgotPassword } from "./hooks/useForgotPassword";

const ForgotPassword = () => {
  const { formMethods } = useFormForgotPassword();
  return (
    <FormProvider {...formMethods}>
      <ForgotPasswordForm />
    </FormProvider>
  );
};

export default ForgotPassword;
