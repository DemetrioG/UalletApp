import { useForm } from "react-hook-form";
import { TicketsDTO } from "../../Configurations/Tickets/types";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { usePromise } from "../../../../hooks/usePromise";
import { handleToast } from "../../../../utils/functions.helper";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { sendTicket } from "../../Configurations/Tickets/query";

const defaultValues: TicketsDTO = {
  type: null,
  comment: null,
};

const schema = yup.object({
  type: yup.string().nullable().required("Informe o tipo do suporte"),
  comment: yup.string().nullable().required("Descreva sua solicitação"),
});

export const useFormTickets = () => {
  const formMethods = useForm<TicketsDTO>({
    defaultValues,
    resolver: yupResolver(schema),
  });

  const { isLoading: isLoadingCreate, handleExecute: handleCreate } =
    useCreateTickets();

  const onSubmit = formMethods.handleSubmit(handleCreate);

  return {
    formMethods,
    isLoadingCreate,
    handleSubmit: onSubmit,
  };
};

export const useCreateTickets = () => {
  const { isLoading, handleExecute } = usePromise(sendTicket);
  const { navigate } = useNavigation<NativeStackNavigationProp<any>>();

  async function execute(formData: TicketsDTO) {
    handleExecute(formData)
      .then(() => {
        navigate("Home");
        return handleToast({
          type: "success",
          text1: "Suporte enviado com sucesso",
        });
      })
      .catch(() => {
        return handleToast({
          type: "error",
          text1: "Erro ao enviar suporte",
        });
      });
  }

  return {
    isLoading,
    handleExecute: execute,
  };
};
