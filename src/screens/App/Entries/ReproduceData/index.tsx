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
import { FormSelectInput } from "../../../../components/Inputs/SelectInput";
import { Loading } from "../../../../components/Loading";
import { omit, pickBy } from "lodash";

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
              <FormSelectInput
                placeholder="Selecione o período"
                control={formMethods.control}
                name="monthRef"
                isRequired
                errors={formMethods.formState.errors.monthRef}
                options={refOptions}
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

const refOptions = [
  {
    value: "1/2023",
    label: "Janeiro/2023",
  },
  {
    value: "2/2023",
    label: "Fevereiro/2023",
  },
  {
    value: "3/2023",
    label: "Março/2023",
  },
  {
    value: "4/2023",
    label: "Abril/2023",
  },
  {
    value: "5/2023",
    label: "Maio/2023",
  },
  {
    value: "6/2023",
    label: "Junho/2023",
  },
  {
    value: "7/2023",
    label: "Julho/2023",
  },
  {
    value: "8/2023",
    label: "Agosto/2023",
  },
  {
    value: "9/2023",
    label: "Setembro/2023",
  },
  {
    value: "10/2023",
    label: "Outubro/2023",
  },
  {
    value: "11/2023",
    label: "Novembro/2023",
  },
  {
    value: "12/2023",
    label: "Dezembro/2023",
  },
];
