import { Toast } from "react-native-toast-message/lib/src/Toast";
import { usePromise } from "../../../../../../hooks/usePromise";
import { registerAlert } from "../query";
import { useNavigation } from "@react-navigation/native";

export const useSubmit = () => {
  const { isLoading, handleExecute } = usePromise(registerAlert);
  const { navigate } = useNavigation();

  async function execute(value: number) {
    handleExecute(value)
      .then(() => {
        navigate("Configuracoes/Alertas" as never);
        Toast.show({
          type: "success",
          text1: "Alerta definido com sucesso",
        });
      })
      .catch(() => {
        Toast.show({
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
