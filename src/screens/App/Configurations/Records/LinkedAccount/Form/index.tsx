import { useEffect } from "react";
import { Keyboard, TouchableWithoutFeedback } from "react-native";
import { useTheme } from "styled-components";
import { useNavigation } from "@react-navigation/native";
import { ChevronLeft } from "lucide-react-native";
import { BackgroundContainer } from "../../../../../../styles/general";
import { Button, Center, HStack, Pressable, Text, VStack } from "native-base";
import { IThemeProvider } from "../../../../../../styles/baseTheme";
import { FormTextInput } from "../../../../../../components/Inputs/TextInput";
import { LinkedAccountFormParams } from "../types";
import When from "../../../../../../components/When";
import { useFormLinkedAccount } from "../hooks/useLinkedAccount";

export const LinkedAccountForm = ({
  route: { params },
}: LinkedAccountFormParams) => {
  const id = params?.email;
  const { theme }: IThemeProvider = useTheme();
  const { goBack } = useNavigation();
  const { formMethods, isLoadingCreate, handleSubmit } = useFormLinkedAccount();

  useEffect(() => {
    params && formMethods.reset(params);
  }, []);

  return (
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
            <Text fontWeight={700}>Conta Conjunta</Text>
          </HStack>
          <Center flex={1}>
            <FormTextInput
              variant="filled"
              placeholder="E-mail"
              control={formMethods.control}
              name="name"
              errors={formMethods.formState.errors.email}
              helperText={formMethods.formState.errors.email?.message}
              isRequired
            />
          </Center>
          <When is={!id}>
            <Button onPress={handleSubmit} isLoading={isLoadingCreate}>
              <Text fontWeight="bold" color="white">
                Compartilhar dados
              </Text>
            </Button>
          </When>
          {/* <When is={!!id}>
            <Button
              variant="outline"
              isLoading={isLoadingDelete}
              isDisabled={isLoadingUpdate || params?.name === "Carteira"}
              onPress={() => handleDelete(id)}
            >
              <Text fontWeight="bold" color={theme?.blue}>
                Excluir
              </Text>
            </Button>
          </When> */}
        </VStack>
      </BackgroundContainer>
    </TouchableWithoutFeedback>
  );
};
