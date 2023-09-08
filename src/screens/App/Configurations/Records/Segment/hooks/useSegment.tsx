import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { ListSegment, SegmentDTO } from "../types";
import { usePromise } from "../../../../../../hooks/usePromise";
import {
  createSegment,
  deleteSegment,
  listSegment,
  updateSegment,
} from "../query";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import * as yup from "yup";
import { handleToast } from "../../../../../../utils/functions.helper";

const defaultValues: SegmentDTO = {
  description: null,
};

const schema = yup.object({
  description: yup
    .string()
    .nullable()
    .required("Informe a descrição do segmento"),
});

export const useFormSegment = (id?: string) => {
  const formMethods = useForm<SegmentDTO>({
    defaultValues,
    resolver: yupResolver(schema),
  });

  const { isLoading: isLoadingCreate, handleExecute: handleCreate } =
    useCreateSegment();
  const { isLoading: isLoadingUpdate, handleExecute: handleUpdate } =
    useUpdateSegment();

  const onSubmit = formMethods.handleSubmit(handleSubmit);

  function handleSubmit(formData: SegmentDTO) {
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

export const useListSegments = () => {
  const { isLoading, handleExecute } = usePromise(listSegment);
  const [list, setList] = useState<ListSegment[]>([]);

  async function execute() {
    const snapshot = await handleExecute();
    const list = snapshot.docs.map((doc) => {
      return { ...doc.data(), id: doc.id };
    }) as ListSegment[];
    return setList(list);
  }

  useEffect(() => {
    execute();
  }, []);

  return {
    isLoading,
    data: list ?? [],
    handleExecute: execute,
  };
};

export const useCreateSegment = () => {
  const { isLoading, handleExecute } = usePromise(createSegment);
  const { goBack } = useNavigation();

  async function execute(formData: SegmentDTO) {
    handleExecute(formData)
      .then(() => {
        goBack();
        return handleToast({
          type: "success",
          text1: "Segmento cadastrado com sucesso",
        });
      })
      .catch(() => {
        return handleToast({
          type: "error",
          text1: "Erro ao cadastrar segmento",
        });
      });
  }

  return {
    isLoading,
    handleExecute: execute,
  };
};

export const useUpdateSegment = () => {
  const { isLoading, handleExecute } = usePromise(updateSegment);
  const { goBack } = useNavigation();

  async function execute(formData: SegmentDTO, id: string) {
    handleExecute(formData, id)
      .then(() => {
        goBack();
        return handleToast({
          type: "success",
          text1: "Segmento atualizado com sucesso",
        });
      })
      .catch(() => {
        return handleToast({
          type: "error",
          text1: "Erro ao atualizar segmento",
        });
      });
  }

  return {
    isLoading,
    handleExecute: execute,
  };
};

export const useDeleteSegment = () => {
  const { isLoading, handleExecute } = usePromise(deleteSegment);
  const { goBack } = useNavigation();

  async function execute(id: string) {
    handleExecute(id)
      .then(() => {
        goBack();
        return handleToast({
          type: "success",
          text1: "Segmento excluído com sucesso",
        });
      })
      .catch((err) => {
        console.log(err);
        return handleToast({
          type: "error",
          text1:
            err.message === "Há lançamentos vinculados a este segmento."
              ? err.message
              : "Erro ao excluir segmento",
        });
      });
  }

  return {
    isLoadingDelete: isLoading,
    handleDelete: execute,
  };
};
