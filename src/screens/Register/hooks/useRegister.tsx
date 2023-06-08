import { useForm } from "react-hook-form";
import * as yup from "yup";
import { RegisterDTO } from "../types";
import { yupResolver } from "@hookform/resolvers/yup";

const schema = yup
  .object({
    name: yup.string().required(),
    email: yup.string().required(),
    password: yup
      .string()
      .required()
      .matches(
        new RegExp(
          "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$"
        )
      ),
    confirm: yup.string().required(),
  })
  .required();
export const useFormRegister = () => {
  const formMethods = useForm<RegisterDTO>({
    resolver: yupResolver(schema),
  });

  return {
    formMethods,
  };
};
