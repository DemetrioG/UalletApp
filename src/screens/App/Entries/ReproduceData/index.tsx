import { FormProvider } from "react-hook-form";
import { Modal } from "../../../../components/Modal";
import { ReturnUseDisclosure } from "../../../../types/types";
import { Button, HStack, Text, VStack } from "native-base";
import { FlatList, Pressable } from "react-native";
import { ChevronLeft } from "lucide-react-native";
import { useTheme } from "styled-components";
import { IThemeProvider } from "../../../../styles/baseTheme";
import {
  useFormReproduceData,
  useGetReproduceData,
} from "./hooks/useReproduceData";
import { ItemList } from "../../Home/Consolidate";

export const ReproduceData = (props: ReturnUseDisclosure) => {
  const { theme }: IThemeProvider = useTheme();
  const { formMethods, handleReproduceData, isLoadingCreate } =
    useFormReproduceData(props.onClose);
  const { list } = useGetReproduceData();

  const anySelectedEntrie = !!Object.keys(formMethods.watch()).length;

  return (
    <Modal {...props} ModalProps={{ swipeDirection: "down" }}>
      <FormProvider {...formMethods}>
        <HStack alignItems="center" space={3} mb={6}>
          <Pressable onPress={props.onClose}>
            <ChevronLeft color={theme?.text} />
          </Pressable>
          <Text fontWeight={700}>Consolidar lançamentos</Text>
        </HStack>
        <VStack space={5} flex={1}>
          <Text textAlign="center">
            Confirme os lançamentos que realmente aconteceram conforme você
            projetou
          </Text>
          <FlatList
            showsVerticalScrollIndicator={false}
            data={list}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => <ItemList item={item} />}
          />
          <Button
            onPress={() => handleReproduceData(formMethods.getValues(), list)}
            isLoading={isLoadingCreate}
            isDisabled={!anySelectedEntrie}
          >
            <Text fontWeight="bold" color="white">
              Reproduzir
            </Text>
          </Button>
        </VStack>
      </FormProvider>
    </Modal>
  );
};
