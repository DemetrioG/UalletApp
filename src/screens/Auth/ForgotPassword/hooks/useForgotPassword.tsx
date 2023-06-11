import { useForm } from "react-hook-form";
import * as yup from "yup";
import { ForgotPasswordDTO } from "../types";
import { yupResolver } from "@hookform/resolvers/yup";

const schema = yup
  .object({
    email: yup.string().required(),
  })
  .required();

export const useFormForgotPassword = () => {
  const formMethods = useForm<ForgotPasswordDTO>({
    resolver: yupResolver(schema),
  });

  return {
    formMethods,
  };
};
