import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { NewEntrieDTO } from "../types";
import { dateValidation } from "../../../../utils/date.helper";
import { usePromise } from "../../../../hooks/usePromise";

const schema = yup
  .object({
    entrydate: yup
      .string()
      .required()
      .min(10)
      .test("date", "Verifique a data informada", (value) =>
        dateValidation(value!)
      ),
    description: yup.string().required(),
    classification: yup
      .string()
      .test("classification", "Informe a classificação", () => true),
    segment: yup.string().test("segment", "Informe o segmento", () => true),
    value: yup.string().required(),
  })
  .required();

export const useFormEntries = () => {
  const formMethods = useForm<NewEntrieDTO>({
    resolver: yupResolver(schema),
  });

  return {
    formMethods,
  };
};

export const useDeleteEntrie = () => {
  const { isLoading, handleExecute } = usePromise(deleteAccount);

  return {};
};
