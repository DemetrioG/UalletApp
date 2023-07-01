import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { NewEntrieDTO } from "../types";
import { dateValidation } from "../../../../utils/date.helper";
import { usePromise } from "../../../../hooks/usePromise";
import { deleteEntry, registerNewEntry, updateEntry } from "../query";
import { ListEntries } from "../../Entries/types";
import Toast from "react-native-toast-message";
import { useNavigation } from "@react-navigation/native";
import { ConfirmContext } from "../../../../context/ConfirmDialog/confirmContext";
import { useContext } from "react";
import { Keyboard } from "react-native";

const defaultValues: NewEntrieDTO = {};

const schema = yup
  .object({
    date: yup
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

export const useFormEntries = (params: ListEntries, id?: number) => {
  const formMethods = useForm<NewEntrieDTO>({
    resolver: yupResolver(schema),
  });

  const { isLoading: isLoadingCreate, handleExecute: handleCreate } =
    useCreateEntrie();
  const { isLoading: isLoadingUpdate, handleExecute: handleUpdate } =
    useUpdateEntrie();

  const handleSubmit = () => {
    Keyboard.dismiss();
    if (!id) return formMethods.handleSubmit(handleCreate);
    return formMethods.handleSubmit((formData) =>
      handleUpdate(formData, id, params)
    );
  };

  return {
    formMethods,
    isLoadingCreate,
    isLoadingUpdate,
    handleSubmit,
  };
};

export const useCreateEntrie = () => {
  const { navigate } = useNavigation();
  const { isLoading, handleExecute } = usePromise(registerNewEntry);

  async function execute(formData: NewEntrieDTO) {
    handleExecute(formData)
      .then(() => {
        Toast.show({
          type: "success",
          text1: "Dados cadastrados com sucesso",
        });
        navigate("Lancamentos" as never);
      })
      .catch(() => {
        Toast.show({
          type: "error",
          text1: "Erro ao cadastrar as informações",
        });
      });
  }

  return {
    isLoading,
    handleExecute: execute,
  };
};

export const useUpdateEntrie = () => {
  const { navigate } = useNavigation();
  const { isLoading, handleExecute } = usePromise(updateEntry);

  async function execute(
    formData: NewEntrieDTO,
    id: number,
    params: ListEntries
  ) {
    handleExecute(formData, id, params)
      .then(() => {
        Toast.show({
          type: "success",
          text1: "Lançamento atualizado com sucesso",
        });
        navigate("Lancamentos" as never);
      })
      .catch(() => {
        Toast.show({
          type: "error",
          text1: "Erro ao atualizar as informações",
        });
      });
  }

  return {
    isLoading,
    handleExecute: execute,
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
