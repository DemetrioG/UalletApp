import { useForm } from "react-hook-form";
import { ItemListType, ReproduceDataDTO } from "../types";
import { ReturnUseDisclosure } from "../../../../../types/types";
import { usePromise } from "../../../../../hooks/usePromise";
import { handleToast } from "../../../../../utils/functions.helper";
import { useEffect, useState } from "react";
import { reproduceData, getData } from "../query";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const schema = yup.object({
  monthRef: yup.string().nullable().required("Informe o período de referência"),
});

export const useFormReproduceData = (
  onClose: ReturnUseDisclosure["onClose"]
) => {
  const formMethods = useForm<ReproduceDataDTO & { monthRef: string }>({
    resolver: yupResolver(schema),
  });

  const { handleReproduceData, isLoadingCreate } =
    useCreateReproduceData(onClose);

  return {
    formMethods,
    handleReproduceData,
    isLoadingCreate,
  };
};

export const useCreateReproduceData = (
  onClose: ReturnUseDisclosure["onClose"]
) => {
  const { isLoading, handleExecute } = usePromise(reproduceData);

  async function execute(
    formData: ReproduceDataDTO & { monthRef: string },
    list: ItemListType[]
  ) {
    const { monthRef, ...formItems } = formData;

    const hasCheckedFiles = list
      .filter((obj) => formItems.hasOwnProperty(obj.id.toString()))
      .map((obj) => {
        return { ...obj, checked: formItems[obj.id.toString()] };
      });

    const data = [
      ...hasCheckedFiles,
      ...list.filter((obj) => !formItems.hasOwnProperty(obj.id.toString())),
    ];

    handleExecute(data)
      .then(() => {
        onClose();
        return handleToast({
          type: "success",
          text1: "Dados reproduzidos com sucesso",
        });
      })
      .catch(() => {
        return handleToast({
          type: "error",
          text1: "Erro ao reproduzir os dados",
        });
      });
  }

  return {
    handleReproduceData: execute,
    isLoadingCreate: isLoading,
  };
};

export const useGetReproduceData = (monthRef: string) => {
  const { isLoading, handleExecute } = usePromise(getData);
  const [list, setList] = useState<ItemListType[]>([]);

  async function execute() {
    handleExecute()
      .then(setList)
      .catch(() => setList([]));
  }

  useEffect(() => {
    if (monthRef) execute();
  }, [monthRef]);

  return {
    isLoading,
    list,
  };
};
