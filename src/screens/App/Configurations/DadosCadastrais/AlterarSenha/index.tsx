import React from "react";
import { FormProvider } from "react-hook-form";
import { AlterarSenhaForm } from "./Form";
import { useFormAlterarSenha } from "./hooks/useAlterarSenha";

export const AlterarSenhaScreen = () => {
  const { formMethods } = useFormAlterarSenha();

  return (
    <FormProvider {...formMethods}>
      <AlterarSenhaForm />
    </FormProvider>
  );
};
