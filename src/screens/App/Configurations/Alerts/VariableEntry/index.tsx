import * as React from "react";
import { Button, Center, HStack, Text, VStack } from "native-base";
import { useNavigation } from "@react-navigation/native";
import Toast from "react-native-toast-message";

import Icon from "../../../../../components/Icon";
import {
  BackgroundContainer,
  ButtonText,
  Slider,
  TextHeaderScreen,
  ViewTab,
} from "../../../../../styles/general";
import { registerAlert } from "./query";
import { InfoNumber } from "./styles";

const VariableEntryScreen = ({
  route: { params },
}: {
  route: { params: number };
}) => {
  const { goBack, navigate } = useNavigation();
  const [value, setValue] = React.useState(params || 50);
  const [loading, setLoading] = React.useState(false);

  function submit() {
    setLoading(true);
    registerAlert(value)
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
      })
      .finally(() => setLoading(false));
  }

  return (
    <BackgroundContainer>
      <ViewTab>
        <HStack alignItems="center" space={3} mb={10}>
          <Icon name="chevron-left" size={24} onPress={goBack} />
          <TextHeaderScreen noMarginBottom>Alertas</TextHeaderScreen>
        </HStack>
        <VStack paddingX={2}>
          <Text fontSize={"md"}>
            Quando suas despesas variáveis ultrapassarem{" "}
            <InfoNumber>{value}%</InfoNumber> de sua receita mensal enviaremos
            um alerta para você!
          </Text>
        </VStack>
        <Center flex={1}>
          <VStack w={"full"}>
            <Slider
              minimumValue={5}
              maximumValue={100}
              value={value}
              onSlidingComplete={(value) => setValue(Number(value.toFixed(0)))}
              tapToSeek
              step={5}
              colorVariant="red"
            />
            <Button mt={65} isLoading={loading} onPress={submit}>
              <ButtonText>CONFIRMAR</ButtonText>
            </Button>
          </VStack>
        </Center>
      </ViewTab>
    </BackgroundContainer>
  );
};

export default VariableEntryScreen;
