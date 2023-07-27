import { useEffect, useState } from "react";
import { usePromise } from "../../../../../hooks/usePromise";
import { consolidateData, getData } from "../query";
import { ConsolidateDTO, ItemListType } from "../types";
import Toast from "react-native-toast-message";
import { useForm } from "react-hook-form";
import { ReturnUseDisclosure } from "../../../../../types/types";

export const useFormConsolidate = () => {
  const formMethods = useForm<ConsolidateDTO>();

  return {
    formMethods,
  };
};

export const useCreateConsolidate = (
  onClose: ReturnUseDisclosure["onClose"]
) => {
  const { isLoading, handleExecute } = usePromise(consolidateData);

  async function execute(formData: ConsolidateDTO, list: ItemListType[]) {
    const hasCheckedFiles = list
      .filter((obj) => formData.hasOwnProperty(obj.id.toString()))
      .map((obj) => {
        return { ...obj, checked: formData[obj.id.toString()] };
      });

    const data = [
      ...hasCheckedFiles,
      ...list.filter((obj) => !formData.hasOwnProperty(obj.id.toString())),
    ];

    handleExecute(data)
      .then(() => {
        onClose();
        return Toast.show({
          type: "success",
          text1: "Dados consolidados com sucesso",
        });
      })
      .catch(() => {
        return Toast.show({
          type: "error",
          text1: "Erro ao consolidar os dados",
        });
      });
  }

  return {
    handleConsolidate: execute,
    isLoading,
  };
};

export const useGetConsolidate = () => {
  const { isLoading, handleExecute } = usePromise(getData);
  const [list, setList] = useState<ItemListType[]>([]);

  async function execute() {
    handleExecute()
      .then(setList)
      .catch(() => setList([]));
  }

  useEffect(() => {
    execute();
  }, []);

  return {
    isLoading,
    list,
  };
};
