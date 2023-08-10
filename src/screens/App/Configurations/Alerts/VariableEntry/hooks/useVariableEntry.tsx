import { usePromise } from "../../../../../../hooks/usePromise";
import { registerAlert } from "../query";
import { useNavigation } from "@react-navigation/native";
import { handleToast } from "../../../../../../utils/functions.helper";

export const useSubmit = () => {
  const { isLoading, handleExecute } = usePromise(registerAlert);
  const { navigate } = useNavigation();

  async function execute(value: number) {
    handleExecute(value)
      .then(() => {
        navigate("Configuracoes/Alertas" as never);
        handleToast({
          type: "success",
          text1: "Alerta definido com sucesso",
        });
      })
      .catch(() => {
        handleToast({
          type: "error",
          text1: "Erro ao definir alerta",
        });
      });
  }

  return {
    isLoading,
    handleSubmit: execute,
  };
};
