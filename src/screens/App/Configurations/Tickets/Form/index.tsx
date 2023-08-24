import { useNavigation } from "@react-navigation/native";
import { IThemeProvider } from "../../../../../styles/baseTheme";
import { useTheme } from "styled-components";
import { Keyboard, TouchableWithoutFeedback } from "react-native";
import {
  BackgroundContainer,
  StyledKeyboardAvoidingView,
} from "../../../../../styles/general";
import { Button, Center, HStack, Pressable, Text, VStack } from "native-base";
import { ChevronLeft } from "lucide-react-native";
import { FormSelectInput } from "../../../../../components/Inputs/SelectInput";
import { FormTextArea } from "../../../../../components/Inputs/TextArea";
import { useFormTickets } from "../hooks/useTickets";

export const TicketsForm = () => {
  const { goBack } = useNavigation();
  const { theme }: IThemeProvider = useTheme();
  const { formMethods, isLoadingCreate, handleSubmit } = useFormTickets();

  return (
    <StyledKeyboardAvoidingView>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <BackgroundContainer>
          <VStack
            backgroundColor={theme?.secondary}
            flex={1}
            p={5}
            borderTopLeftRadius="30px"
            borderTopRightRadius="30px"
          >
            <HStack alignItems="center" space={3} mb={10}>
              <Pressable onPress={goBack}>
                <ChevronLeft color={theme?.text} />
              </Pressable>
              <Text fontWeight={700}>Suporte</Text>
            </HStack>
            <VStack paddingX={2}>
              <Text fontSize={"md"}>
                Preencha as informações abaixo e iremos trabalhar na solução do
                seu problema
              </Text>
            </VStack>
            <Center flex={1}>
              <FormSelectInput
                variant="filled"
                name="type"
                placeholder="Tipo do suporte"
                control={formMethods.control}
                errors={formMethods.formState.errors.type}
                options={typeOptions}
                isRequired
              />
              <FormTextArea
                variant="filled"
                name="comment"
                placeholder="Descrição"
                control={formMethods.control}
                errors={formMethods.formState.errors.comment}
                helperText="Preencha todos os campos"
                isRequired
              />
            </Center>
            <Button onPress={handleSubmit} isLoading={isLoadingCreate}>
              <Text fontWeight="bold" color="white">
                Enviar
              </Text>
            </Button>
          </VStack>
        </BackgroundContainer>
      </TouchableWithoutFeedback>
    </StyledKeyboardAvoidingView>
  );
};

const typeOptions = [
  { label: "Problema", value: "Problema" },
  { label: "Sugestão", value: "Sugestao" },
];
