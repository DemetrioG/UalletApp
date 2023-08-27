import { Button, Center, Progress, Text, VStack } from "native-base";
import {
  BackgroundContainer,
  BackgroundEffect,
} from "../../../../styles/general";
import { IThemeProvider } from "../../../../styles/baseTheme";
import { useTheme } from "styled-components";
import { FormTextInputCalendar } from "../../../../components/Inputs/TextInputCalendar";
import { useFormComplete } from "../hooks/useComplete";
import { Keyboard } from "react-native";
import { TouchableWithoutFeedback } from "react-native";
import { FormSelectInput } from "../../../../components/Inputs/SelectInput";
import { FormTextInput } from "../../../../components/Inputs/TextInput";

export const CompleteForm = () => {
  const { theme }: IThemeProvider = useTheme();
  const { formMethods, isLoading, handleSubmit } = useFormComplete();
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <BackgroundContainer p="20px">
        <BackgroundEffect />
        <VStack space={5}>
          <Progress
            backgroundColor={theme?.secondary}
            _filledTrack={{ bg: "#6499E3" }}
            value={70}
            mt={5}
          />
          <Text fontSize="36" fontWeight="700" color="white">
            Informações pessoais
          </Text>
        </VStack>
        <Center flex={1}>
          <FormTextInputCalendar
            placeholder="Data de nascimento"
            control={formMethods.control}
            name="birthDate"
            formMethods={formMethods}
            errors={formMethods.formState.errors.birthDate}
            setDateOnOpen
            isRequired
          />
          <FormSelectInput
            placeholder="Sexo"
            control={formMethods.control}
            name="gender"
            errors={formMethods.formState.errors.gender}
            options={genderOptions}
            isRequired
          />
          <FormSelectInput
            placeholder="Perfil financeiro"
            control={formMethods.control}
            name="profile"
            errors={formMethods.formState.errors.profile}
            options={profileOptions}
          />
          <FormTextInput
            placeholder="Renda média"
            masked="money"
            control={formMethods.control}
            name="income"
            errors={formMethods.formState.errors.income}
          />
        </Center>
        <Button onPress={handleSubmit} isLoading={isLoading}>
          <Text fontWeight="bold" color="white">
            Concluir
          </Text>
        </Button>
      </BackgroundContainer>
    </TouchableWithoutFeedback>
  );
};

const genderOptions = [
  {
    value: "Masculino",
    label: "Masculino",
  },
  {
    value: "Feminino",
    label: "Feminino",
  },
];

const profileOptions = [
  {
    value: "Gastador",
    label: "Gastador",
  },
  {
    value: "Poupador",
    label: "Poupador",
  },
  {
    value: "Investidor",
    label: "Investidor",
  },
];
