import { FormProvider, useWatch } from "react-hook-form";
import { Modal } from "../../../../components/Modal";
import { ReturnUseDisclosure } from "../../../../types/types";
import { Button, Center, HStack, Text, VStack } from "native-base";
import { FlatList, Pressable } from "react-native";
import { ChevronLeft } from "lucide-react-native";
import { useTheme } from "styled-components";
import { IThemeProvider } from "../../../../styles/baseTheme";
import {
  useFormReproduceData,
  useGetReproduceData,
} from "./hooks/useReproduceData";
import { ItemList } from "../../Home/Consolidate";
import { useState } from "react";
import When from "../../../../components/When";
import { Loading } from "../../../../components/Loading";
import { omit, pickBy } from "lodash";
import { FormFetchableSelectInputReprocuce } from "../../../../components/Inputs/FetchableSelectInputReproduce";

export const ReproduceData = (props: ReturnUseDisclosure) => {
  const { theme }: IThemeProvider = useTheme();
  const { formMethods, handleReproduceData, isLoadingCreate } =
    useFormReproduceData(props.onClose);

  const [monthRef] = useWatch({
    control: formMethods.control,
    name: ["monthRef"],
  });

  const { list, isLoading } = useGetReproduceData(monthRef);

  const [page, setPage] = useState(1);

  const anySelectedEntrie = !!Object.keys(
    pickBy(omit(formMethods.watch(), "monthRef"))
  ).length;

  function handlePageChange() {
    return setPage(2);
  }

  return (
    <Modal
      {...props}
      ModalProps={{ swipeDirection: "down" }}
      ContainerProps={{ height: page === 1 ? "300px" : "85%" }}
    >
      <FormProvider {...formMethods}>
        <HStack alignItems="center" space={3} mb={6}>
          <Pressable onPress={props.onClose}>
            <ChevronLeft color={theme?.text} />
          </Pressable>
          <Text fontWeight={700}>Lançamentos para reproduzir</Text>
        </HStack>
        <When is={page === 1}>
          <VStack space={5} flex={1}>
            <Center flex={1}>
              <FormFetchableSelectInputReprocuce
                control={formMethods.control}
                name="monthRef"
                isRequired
                errors={formMethods.formState.errors.monthRef}
              />
            </Center>
            <Button
              onPress={() => {
                formMethods.handleSubmit(handlePageChange)();
              }}
            >
              <Text fontWeight="bold" color="white">
                Prosseguir
              </Text>
            </Button>
          </VStack>
        </When>
        <When is={page === 2}>
          <VStack space={5} flex={1}>
            <Text textAlign="center">
              Selecione os lançamentos anteriores que deseja reproduzir para o
              período atual
            </Text>
            <When is={isLoading}>
              <Loading />
            </When>
            <When is={!isLoading}>
              <FlatList
                showsVerticalScrollIndicator={false}
                data={list}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => <ItemList item={item} />}
              />
            </When>
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
        </When>
      </FormProvider>
    </Modal>
  );
};
