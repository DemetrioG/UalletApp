import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { NewEntrieDTO } from "../types";
import {
  convertDateFromDatabase,
  dateValidation,
} from "../../../../utils/date.helper";
import { usePromise } from "../../../../hooks/usePromise";
import { deleteEntry, registerNewEntry, updateEntry } from "../query";
import { ListEntries } from "../../Entries/types";
import Toast from "react-native-toast-message";
import { useNavigation } from "@react-navigation/native";
import { ConfirmContext } from "../../../../context/ConfirmDialog/confirmContext";
import { useContext, useEffect } from "react";
import { numberToReal } from "../../../../utils/number.helper";
import { DataContext } from "../../../../context/Data/dataContext";

const defaultValues: NewEntrieDTO = {
  date: null,
  description: null,
  modality: null,
  type: null,
  value: null,
};

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
    modality: yup.string().required("Informe a modalidade"),
    segment: yup.string().nullable(),
    value: yup.string().required("Informe o valor"),
  })
  .required();

const formatFormData = (formData: ListEntries) => {
  const formatted: NewEntrieDTO = {
    date: convertDateFromDatabase(formData.date),
    description: formData.description,
    modality: formData.modality,
    segment: formData.segment,
    type: formData.type,
    value: numberToReal(formData.value),
    id: formData.id,
  };
  return formatted;
};

export const useFormEntries = (params: ListEntries, id?: number) => {
  const { data } = useContext(DataContext);
  const formMethods = useForm<NewEntrieDTO>({
    defaultValues: { ...defaultValues, modality: data?.modality },
    resolver: yupResolver(schema),
  });

  const { isLoading: isLoadingCreate, handleExecute: handleCreate } =
    useCreateEntrie();
  const { isLoading: isLoadingUpdate, handleExecute: handleUpdate } =
    useUpdateEntrie();

  const onSubmit = (formData: NewEntrieDTO) => {
    if (id) {
      return handleUpdate(formData, params, id);
    } else {
      return handleCreate(formData);
    }
  };

  const handleSubmit = formMethods.handleSubmit(onSubmit);

  useEffect(() => {
    params && formMethods.reset(formatFormData(params));
  }, [params]);

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
    params: ListEntries,
    id?: number
  ) {
    if (!id) throw new Error("Identificador não encontrado");
    console.log(formData);
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
