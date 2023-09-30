import { useNavigation } from "@react-navigation/native";
import { usePromise } from "../../../../hooks/usePromise";
import {
  createTransfer,
  deleteTransfer,
  listTransfer,
  updateTransfer,
} from "../query";
import { ListTransfers, ListTransfersProps, TransfersDTO } from "../types";
import { handleToast } from "../../../../utils/functions.helper";
import { useContext, useEffect, useState } from "react";
import { ConfirmContext } from "../../../../context/ConfirmDialog/confirmContext";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { dateValidation } from "../../../../utils/date.helper";
import { DataContext } from "../../../../context/Data/dataContext";

const defaultValues: TransfersDTO = {
  date: null,
  originAccount: null,
  destinationAccount: null,
  value: null,
};

const schema = yup.object({
  date: yup
    .string()
    .required()
    .min(10)
    .test("date", "Verifique a data informada", (value) =>
      dateValidation(value!)
    ),
  originAccount: yup.string().nullable().required("Informe a conta de origem"),
  destinationAccount: yup
    .string()
    .nullable()
    .required("Informe a conta de destino")
    .test(
      "destinationAccount",
      "A conta de destino não pode ser igual à conta de origem",
      function (value) {
        const originAccount = this.parent.originAccount;
        return value !== originAccount;
      }
    ),
  value: yup.string().nullable().required(),
});

export const useFormTransfer = (id?: number) => {
  const formMethods = useForm<TransfersDTO>({
    defaultValues,
    resolver: yupResolver(schema),
  });

  const { isLoading: isLoadingCreate, handleExecute: handleCreate } =
    useCreateTransfer();
  const { isLoading: isLoadingUpdate, handleExecute: handleUpdate } =
    useUpdateTransfer();

  const onSubmit = formMethods.handleSubmit(handleSubmit);

  function handleSubmit(formData: TransfersDTO) {
    if (!id) {
      return handleCreate(formData);
    }
    return handleUpdate(formData, id);
  }

  return {
    formMethods,
    isLoadingCreate,
    isLoadingUpdate,
    handleSubmit: onSubmit,
  };
};

export const useListTransfers = (props: ListTransfersProps) => {
  const { isLoading, handleExecute } = usePromise(listTransfer);
  const [list, setList] = useState<ListTransfers[]>([]);
  const { data } = useContext(DataContext);

  async function execute() {
    const list = await handleExecute({
      ...data,
      filters: props.server?.filters,
    });
    return setList(list);
  }

  useEffect(() => {
    execute();
  }, [data.modality, data.month, data.year, data.trigger]);

  return {
    isLoading,
    data: list ?? [],
    handleExecute: execute,
  };
};

export const useCreateTransfer = () => {
  const { isLoading, handleExecute } = usePromise(createTransfer);
  const { goBack } = useNavigation();

  async function execute(formData: TransfersDTO) {
    handleExecute(formData)
      .then(() => {
        goBack();
        return handleToast({
          type: "success",
          text1: "Transferência realizada com sucesso",
        });
      })
      .catch(() => {
        return handleToast({
          type: "error",
          text1: "Erro ao realizar transferência",
        });
      });
  }

  return {
    isLoading,
    handleExecute: execute,
  };
};

export const useUpdateTransfer = () => {
  const { isLoading, handleExecute } = usePromise(updateTransfer);
  const { goBack } = useNavigation();

  async function execute(formData: TransfersDTO, id: number) {
    handleExecute(formData, id)
      .then(() => {
        goBack();
        return handleToast({
          type: "success",
          text1: "Transferência atualizada com sucesso",
        });
      })
      .catch(() => {
        return handleToast({
          type: "error",
          text1: "Erro ao atualizar transferência",
        });
      });
  }

  return {
    isLoading,
    handleExecute: execute,
  };
};

export const useHandleConfirmDeleteTransfer = () => {
  const { isLoadingDelete, handleDelete } = useDeleteTransfer();
  const { setConfirm } = useContext(ConfirmContext);

  function execute(formData: ListTransfers) {
    setConfirm(() => ({
      title: "Deseja excluir esta transferência?",
      visibility: true,
      callbackFunction: () => handleDelete(formData),
    }));
  }

  return {
    isLoadingDelete,
    handleDelete: execute,
  };
};

const useDeleteTransfer = () => {
  const { isLoading, handleExecute } = usePromise(deleteTransfer);
  const { goBack } = useNavigation();

  async function execute(formData: ListTransfers) {
    handleExecute(formData)
      .then(() => {
        goBack();
        return handleToast({
          type: "success",
          text1: "Transferência excluída com sucesso",
        });
      })
      .catch((err) => {
        return handleToast({
          type: "error",
          text1: "Erro ao excluir transferência",
        });
      });
  }

  return {
    isLoadingDelete: isLoading,
    handleDelete: execute,
  };
};
