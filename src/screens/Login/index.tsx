import { FormProvider } from "react-hook-form";
import LoginForm from "./Form";
import { useFormLogin } from "./hooks/useLogin";

const Login = () => {
  const { formMethods } = useFormLogin();

  return (
    <FormProvider {...formMethods}>
      <LoginForm />
    </FormProvider>
  );
};

export default Login;
