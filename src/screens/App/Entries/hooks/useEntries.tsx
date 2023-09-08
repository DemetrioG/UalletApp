import { useContext, useEffect, useState } from "react";
import { usePromise } from "../../../../hooks/usePromise";
import {
  deleteEntry,
  getEntries,
  registerNewEntry,
  updateEntry,
} from "../querys";
import { DataContext } from "../../../../context/Data/dataContext";
import { ListEntries, ListEntriesProps, NewEntrieDTO } from "../types";
import * as yup from "yup";
import {
  convertDateFromDatabase,
  dateValidation,
} from "../../../../utils/date.helper";
import { numberToReal } from "../../../../utils/number.helper";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigation } from "@react-navigation/native";
import { ConfirmContext } from "../../../../context/ConfirmDialog/confirmContext";
import { handleToast } from "../../../../utils/functions.helper";
import { QueryDocumentSnapshot } from "firebase/firestore";

const defaultValues: NewEntrieDTO = {
  date: null,
  description: null,
  modality: null,
  account: null,
  type: null,
  value: null,
  recurrent: false,
  quantity: null,
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
    account: yup.string().required("Informe a conta"),
    segment: yup.string().nullable(),
    value: yup.string().required("Informe o valor"),
    recurrent: yup.boolean(),
    quantity: yup.string().when("recurrent", {
      is: true,
      then: yup.string().nullable().required("Informe os meses"),
      otherwise: yup.string().nullable(),
    }),
  })
  .required();

const formatFormData = (formData: ListEntries) => {
  const formatted = {
    date: convertDateFromDatabase(formData.date),
    description: formData.description,
    modality: formData.modality,
    account: formData.account,
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
  const { setData } = useContext(DataContext);
  const { isLoading, handleExecute } = usePromise(registerNewEntry);

  async function execute(formData: NewEntrieDTO) {
    handleExecute(formData)
      .then(() => {
        handleToast({
          type: "success",
          text1: "Dados cadastrados com sucesso",
        });
        setData((rest) => ({
          ...rest,
          trigger: Math.random(),
        }));
        navigate("Lancamentos" as never);
      })
      .catch((e) => {
        console.error(e);
        handleToast({
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
  const { setData } = useContext(DataContext);
  const { isLoading, handleExecute } = usePromise(updateEntry);

  async function execute(
    formData: NewEntrieDTO,
    params: ListEntries,
    id?: number
  ) {
    if (!id) throw new Error("Identificador não encontrado");
    handleExecute(formData, id, params)
      .then(() => {
        handleToast({
          type: "success",
          text1: "Lançamento atualizado com sucesso",
        });
        setData((rest) => ({
          ...rest,
          trigger: Math.random(),
        }));
        navigate("Lancamentos" as never);
      })
      .catch(() => {
        handleToast({
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
  const { setData } = useContext(DataContext);
  const { isLoading, handleExecute } = usePromise(deleteEntry);

  async function execute(params: ListEntries) {
    handleExecute(params)
      .then(() => {
        handleToast({
          type: "success",
          text1: "Lançamento excluído com sucesso",
        });
        setData((rest) => ({
          ...rest,
          trigger: Math.random(),
        }));
        navigate("Lancamentos" as never);
      })
      .catch(() => {
        handleToast({
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

export const useGetEntries = (props: ListEntriesProps) => {
  const { isLoading, handleExecute } = usePromise(getEntries);
  const { data } = useContext(DataContext);

  const [empty, setEmpty] = useState(false);
  const [list, setList] = useState<ListEntries[]>([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isLastPage, setIsLastPage] = useState(true);
  const [lastVisible, setLastVisible] = useState<QueryDocumentSnapshot | null>(
    null
  );

  async function execute(lastVisible?: QueryDocumentSnapshot | null) {
    if (lastVisible) setIsLoadingMore(true);
    const snapshot = await handleExecute({
      ...data,
      filters: props.server?.filters,
      pagination: {
        lastVisible,
      },
    });

    if (!snapshot.docs.length) setEmpty(true);
    const last = snapshot.docs[snapshot.docs.length - 1];
    const list = snapshot.docs.map((doc) => doc.data()) as ListEntries[];

    if (lastVisible) {
      setIsLoadingMore(false);
      setList((rest) => [...rest, ...list]);
    } else {
      setList(list);
    }
    setIsLastPage(!Boolean(list[24]));
    return setLastVisible(last);
  }

  return {
    isLoading: isLoading && !isLoadingMore,
    isLoadingMore,
    isLastPage,
    isEmpty: empty,
    lastVisible,
    data: list ?? [],
    handleGetData: execute,
  };
};
