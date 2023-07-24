import { Keyboard } from "react-native";
import { TouchableWithoutFeedback } from "react-native";
import { BackgroundContainer } from "../../../../../../styles/general";
import { Button, Center, HStack, Pressable, Text, VStack } from "native-base";
import { useTheme } from "styled-components";
import { ChevronLeft } from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";
import { IThemeProvider } from "../../../../../../styles/baseTheme";
import { FormTextInput } from "../../../../../../components/Inputs/TextInput";
import { useDeleteSegment, useFormSegment } from "../hooks/useSegment";
import { SegmentFormParams } from "../types";
import { useEffect } from "react";
import When from "../../../../../../components/When";

export const SegmentForm = ({ route: { params } }: SegmentFormParams) => {
  const id = params?.id;
  const { theme }: IThemeProvider = useTheme();
  const { goBack } = useNavigation();
  const { formMethods, isLoadingCreate, isLoadingUpdate, handleSubmit } =
    useFormSegment(id);
  const { isLoadingDelete, handleDelete } = useDeleteSegment();

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
            <Text fontWeight={700}>Cadastrar Segmento</Text>
          </HStack>
          <Center flex={1}>
            <FormTextInput
              variant="filled"
              placeholder="Descrição"
              control={formMethods.control}
              name="description"
              errors={formMethods.formState.errors.description}
              isRequired
            />
          </Center>
          <When is={!id}>
            <Button onPress={handleSubmit} isLoading={isLoadingCreate}>
              <Text fontWeight="bold" color="white">
                Cadastrar
              </Text>
            </Button>
          </When>
          <When is={!!id && formMethods.formState.isDirty}>
            <Button
              isLoading={isLoadingUpdate}
              isDisabled={isLoadingDelete}
              onPress={handleSubmit}
            >
              <Text fontWeight="bold" color="white">
                Atualizar
              </Text>
            </Button>
          </When>
          <When is={!!id}>
            <Button
              variant="outline"
              isLoading={isLoadingDelete}
              isDisabled={isLoadingUpdate}
              onPress={() => handleDelete(id)}
            >
              <Text fontWeight="bold" color={theme?.blue}>
                Excluir
              </Text>
            </Button>
          </When>
        </VStack>
      </BackgroundContainer>
    </TouchableWithoutFeedback>
  );
};
