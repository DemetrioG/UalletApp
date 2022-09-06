import * as React from "react";
import { Button, HStack, VStack } from "native-base";
import { useNavigation } from "@react-navigation/native";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import Icon from "../../components/Icon";
import Picker from "../../components/Picker";
import {
  BackgroundContainer,
  ButtonText,
  ContainerCenter,
  FormContainer,
  TextHeaderScreen,
  ViewTab,
  ViewTabContent,
} from "../../styles/general";
import { TYPE_OF_INVEST } from "../../components/Picker/options";

const NewAsset = () => {
  const navigation = useNavigation();
  const [type, setType] = React.useState(null);
  const [typeVisible, setTypeVisible] = React.useState(false);

  const schema = yup
    .object({
      type: yup
        .string()
        .test("type", "Informe o tipo do investimento", () => type!),
    })
    .required();

  const {
    handleSubmit,
    formState: { errors },
  } = useForm<{ type: string }>({
    resolver: yupResolver(schema),
  });

  function submit() {
    const route =
      type === "Renda fixa"
        ? "Investimentos/NovoAtivoFixo"
        : "Investimentos/NovoAtivoVariavel";
    return navigation.navigate(route as never);
  }

  return (
    <BackgroundContainer>
      <ViewTab>
        <ViewTabContent noPaddingBottom>
          <HStack>
            <Icon
              name="chevron-left"
              style={{ marginRight: 10 }}
              onPress={() => navigation.goBack()}
            />
            <TextHeaderScreen noMarginBottom>
              Tipo de investimento
            </TextHeaderScreen>
          </HStack>
          <ContainerCenter>
            <VStack width={"full"}>
              <FormContainer insideApp>
                <Picker
                  options={TYPE_OF_INVEST}
                  selectedValue={setType}
                  value={!type ? "Tipo" : type}
                  type="Tipo"
                  visibility={typeVisible}
                  setVisibility={setTypeVisible}
                  errors={errors.type}
                  helperText="Informe o tipo do investimento"
                />
              </FormContainer>
            </VStack>
            <Button onPress={handleSubmit(submit)}>
              <ButtonText>AVANÇAR</ButtonText>
            </Button>
          </ContainerCenter>
        </ViewTabContent>
      </ViewTab>
    </BackgroundContainer>
  );
};

export default NewAsset;
