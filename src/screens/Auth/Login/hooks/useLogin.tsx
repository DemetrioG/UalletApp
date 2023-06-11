import { useForm } from "react-hook-form";
import * as yup from "yup";
import { LoginDTO } from "../types";
import { yupResolver } from "@hookform/resolvers/yup";

const schema = yup
  .object({
    email: yup.string().required(),
    password: yup.string().required(),
  })
  .required();

export const useFormLogin = () => {
  const formMethods = useForm<LoginDTO>({
    resolver: yupResolver(schema),
  });

  return {
    formMethods,
  };
};
