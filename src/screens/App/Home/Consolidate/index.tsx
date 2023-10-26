import { useState } from "react";
import { FlatList } from "react-native";
import { ChevronLeft } from "lucide-react-native";
import { useTheme } from "styled-components";
import LottieView from "lottie-react-native";
import {
  Button,
  Center,
  Checkbox,
  HStack,
  Pressable,
  Text,
  VStack,
} from "native-base";
import { Modal } from "../../../../components/Modal";
import When from "../../../../components/When";
import { numberToReal } from "../../../../utils/number.helper";
import { convertDateFromDatabase } from "../../../../utils/date.helper";
import { IThemeProvider } from "../../../../styles/baseTheme";
import { ReturnUseDisclosure } from "../../../../types/types";
import { ConsolidateDTO, ListProps } from "./types";
import {
  useCreateConsolidate,
  useFormConsolidate,
  useGetConsolidate,
} from "./hooks/useConsolidate";

import WRITE from "../../../../../assets/icons/write.json";
import { FormProvider, useFormContext } from "react-hook-form";
import { FormCheckboxInput } from "../../../../components/Inputs/CheckboxInput";

const Consolidate = (props: ReturnUseDisclosure) => {
  const { theme }: IThemeProvider = useTheme();
  const [page, setPage] = useState(1);
  const { formMethods } = useFormConsolidate();
  const { isLoading, handleConsolidate } = useCreateConsolidate(props.onClose);
  const { list } = useGetConsolidate();

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
        <When is={page === 1}>
          <VStack space={5} flex={1}>
            <Center flex={1}>
              <Text textAlign="center">
                Verificamos alguns lançamentos que você projetou para o dia de
                hoje
              </Text>
              <LottieView
                source={WRITE}
                autoPlay
                loop={false}
                style={{ width: 250, marginBottom: 15 }}
              />
              <Text textAlign="center">
                Prossiga para realizar a consolidação!
              </Text>
            </Center>
            <Button onPress={() => setPage(2)}>
              <Text fontWeight="bold" color="white">
                Prosseguir
              </Text>
            </Button>
          </VStack>
        </When>
        <When is={page === 2}>
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
              onPress={() => handleConsolidate(formMethods.getValues(), list)}
              isLoading={isLoading}
              isDisabled={!anySelectedEntrie}
            >
              <Text fontWeight="bold" color="white">
                Consolidar
              </Text>
            </Button>
          </VStack>
        </When>
      </FormProvider>
    </Modal>
  );
};

export const ItemList = ({ item }: ListProps) => {
  const { theme }: IThemeProvider = useTheme();
  const formMethods = useFormContext<ConsolidateDTO>();

  return (
    <HStack
      alignItems="center"
      justifyContent="space-between"
      w="100%"
      paddingY={3}
      borderBottomWidth={1}
      borderColor={theme?.primary}
    >
      <VStack>
        <Text fontWeight={500}>{item.description}</Text>
        <Text fontSize="14px" opacity={0.8} numberOfLines={1}>
          {convertDateFromDatabase(item.date).slice(0, 5)}
        </Text>
      </VStack>
      <HStack space={4}>
        <Text fontWeight={600}>
          {item.type === "Receita" ? "+" : "-"}
          {numberToReal(item.value)}
        </Text>
        <FormCheckboxInput
          name={item.id.toString()}
          control={formMethods.control}
        />
      </HStack>
    </HStack>
  );
};

export default Consolidate;
