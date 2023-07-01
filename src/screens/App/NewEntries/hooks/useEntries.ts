import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { NewEntrieDTO } from "../types";
import { dateValidation } from "../../../../utils/date.helper";
import { usePromise } from "../../../../hooks/usePromise";
import { deleteEntry } from "../query";
import { ListEntries } from "../../Entries/types";
import Toast from "react-native-toast-message";
import { useNavigation } from "@react-navigation/native";
import { ConfirmContext } from "../../../../context/ConfirmDialog/confirmContext";
import { useContext } from "react";

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

export const useHandleConfirmDeleteEntrie = () => {
  const { isLoading, handleDelete } = useDeleteEntrie();
  const { setConfirm } = useContext(ConfirmContext);

  function execute(params: ListEntries) {
    setConfirm(() => ({
      title: "Deseja excluir este lançamento?",
      visibility: true,
      callbackFunction: () => handleDelete(params),
    }));
  }

  return {
    isLoading,
    handleDelete: execute,
  };
};

const useDeleteEntrie = () => {
  const { navigate } = useNavigation();
  const { isLoading, handleExecute } = usePromise(deleteEntry);

  async function execute(params: ListEntries) {
    handleExecute(params)
      .then(() => {
        Toast.show({
          type: "success",
          text1: "Lançamento excluído com  sucesso",
        });
        navigate("Lancamentos" as never);
      })
      .catch(() => {
        Toast.show({
          type: "error",
          text1: "Erro ao excluir o lançamento",
        });
      });
  }

  return {
    isLoading,
    handleDelete: execute,
  };
};
