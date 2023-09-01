import { FormProvider } from "react-hook-form";
import { LoginForm } from "./Form";
import { useFormLogin } from "./hooks/useLogin";
import { LoginParams } from "./types";

export const Login = ({ route: { params } }: LoginParams) => {
  const { formMethods } = useFormLogin();
  return (
    <FormProvider {...formMethods}>
      <LoginForm email={params?.email} />
    </FormProvider>
  );
};
