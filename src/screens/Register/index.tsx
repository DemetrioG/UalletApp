import { FormProvider } from "react-hook-form";
import { RegisterForm } from "./Form";
import { useFormRegister } from "./hooks/useRegister";

export const Register = () => {
  const { formMethods } = useFormRegister();
  return (
    <FormProvider {...formMethods}>
      <RegisterForm />
    </FormProvider>
  );
};
