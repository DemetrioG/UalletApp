import { useEffect } from "react";
import { Keyboard, TouchableWithoutFeedback } from "react-native";
import { useTheme } from "styled-components";
import { useNavigation } from "@react-navigation/native";
import { ChevronLeft, Heart } from "lucide-react-native";
import { BackgroundContainer } from "../../../../../styles/general";
import { Button, Center, HStack, Pressable, Text, VStack } from "native-base";
import { IThemeProvider } from "../../../../../styles/baseTheme";
import { FormTextInput } from "../../../../../components/Inputs/TextInput";
import When from "../../../../../components/When";
import {
  useFormLinkedAccount,
  useHandleConfirmDeleteLinkedAccount,
} from "../hooks/useLinkedAccount";
import { LinkedAccountFormParams } from "../types";

export const LinkedAccountForm = ({
  route: { params },
}: LinkedAccountFormParams) => {
  const id = params?.email;
  const { theme }: IThemeProvider = useTheme();
  const { goBack } = useNavigation();
  const { formMethods, isLoadingCreate, handleSubmit } = useFormLinkedAccount();
  const { isLoadingDelete, handleDelete } =
    useHandleConfirmDeleteLinkedAccount();

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
          <HStack alignItems="center" justifyContent="space-between" mb={10}>
            <HStack space={3}>
              <Pressable onPress={goBack}>
                <ChevronLeft color={theme?.text} />
              </Pressable>
              <Text fontWeight={700}>Conta Conjunta</Text>
            </HStack>
            <Heart color={theme?.red} />
          </HStack>
          <Text textAlign="center">
            Compartilhe suas informações financeiras com um usuário ativo
          </Text>
          <Center flex={1}>
            <FormTextInput
              variant="filled"
              keyboardType="email-address"
              autoCorrect={false}
              autoCapitalize="none"
              placeholder="E-mail"
              control={formMethods.control}
              name="email"
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
          <When is={!!id && !!params.youShared}>
            <Button
              variant="outline"
              isLoading={isLoadingDelete}
              onPress={() => handleDelete(params)}
            >
              <Text fontWeight="bold" color={theme?.blue}>
                Desvincular
              </Text>
            </Button>
          </When>
        </VStack>
      </BackgroundContainer>
    </TouchableWithoutFeedback>
  );
};
