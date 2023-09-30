import { useTheme } from "styled-components";
import { IThemeProvider } from "../../../styles/baseTheme";
import { BackgroundContainer } from "../../../styles/general";
import {
  Button,
  Center,
  FlatList,
  HStack,
  Pressable,
  Text,
  VStack,
  useDisclose,
} from "native-base";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import {
  ArrowRightLeft,
  ChevronLeft,
  Filter,
  InfoIcon,
} from "lucide-react-native";
import Tooltip from "../../../components/Tooltip";
import When from "../../../components/When";

import LottieView from "lottie-react-native";
import LoadingAnimation from "../../../../assets/icons/blueLoading.json";
import { metrics } from "../../../styles";
import { useListTransfers } from "./hooks/useTransfers";
import { Item } from "./Item";
import { ModalFilter } from "./ModalFilter";
import { ListTransfers } from "./types";
import { useFilters } from "../../../hooks/useFilters";
import { numberToReal } from "../../../utils/number.helper";
import { ServerFilterFields } from "./ModalFilter/types";
import { useEffect } from "react";

export const Transfers = () => {
  const { theme }: IThemeProvider = useTheme();
  const { navigate, goBack } = useNavigation<NativeStackNavigationProp<any>>();
  const filterModal = useDisclose();
  const isFocused = useIsFocused();

  const { filterMethods, clientFilters, serverFilters, hasFilter } =
    useFilters<ListTransfers>();
  const {
    isLoading,
    data: list,
    handleExecute,
  } = useListTransfers({
    server: { filters: serverFilters as ServerFilterFields },
  });

  const filtered = list.filter(clientFilters);
  const total = filtered.reduce((total, item) => total + item.value, 0);

  useEffect(() => {
    handleExecute();
  }, [isFocused]);

  return (
    <BackgroundContainer>
      <VStack
        backgroundColor={theme?.secondary}
        flex={1}
        p={5}
        borderTopLeftRadius="30px"
        borderTopRightRadius="30px"
      >
        <HStack justifyContent="space-between">
          <HStack alignItems="center" space={3} mb={6}>
            <Pressable onPress={goBack}>
              <ChevronLeft color={theme?.text} />
            </Pressable>
            <Text fontWeight={700}>Transferências</Text>
          </HStack>
          <Pressable>
            <Tooltip label="Transferências realizadas entre contas">
              <InfoIcon color={theme?.text} />
            </Tooltip>
          </Pressable>
        </HStack>
        <HStack space={2} justifyContent="flex-end">
          <Button
            variant="outline"
            minW="0px"
            minH="0px"
            w="50px"
            onPress={filterModal.onToggle}
          >
            <Filter color={theme?.blue} size={16} />
          </Button>
          <Button
            minW="0px"
            minH="0px"
            w="110px"
            p={0}
            onPress={() => navigate("Transfers/Form")}
          >
            <Text fontSize="14px" color="white">
              Novo
            </Text>
          </Button>
        </HStack>
        <When is={!isLoading}>
          <VStack height="68%">
            <When is={!filtered.length}>
              <Center flex={1}>
                <Text>Não há transferências para visualizar</Text>
              </Center>
            </When>
            <When is={!!filtered.length}>
              <FlatList
                data={filtered}
                renderItem={({ item, index }) => (
                  <Item row={item} index={index} />
                )}
                keyExtractor={(item, index) => index.toString()}
                showsVerticalScrollIndicator={false}
              />
            </When>
          </VStack>
        </When>
        <When is={isLoading}>
          <Center flex={1}>
            <LottieView
              source={LoadingAnimation}
              autoPlay={true}
              loop={true}
              style={{ width: 50 }}
            />
          </Center>
        </When>
        <HStack
          zIndex={2}
          backgroundColor={theme?.primary}
          position="absolute"
          alignItems="center"
          justifyContent="space-between"
          paddingX={6}
          paddingY={2}
          w={metrics.screenWidth}
          left={0}
          bottom={0}
          borderTopLeftRadius="30px"
          borderTopRightRadius="30px"
        >
          <HStack space={2}>
            <Text>Total:</Text>
            <Text>{numberToReal(total)}</Text>
          </HStack>
          <VStack
            backgroundColor={theme?.tertiary}
            alignItems="center"
            justifyContent="center"
            p={1}
            borderRadius={50}
            h="45px"
            w="45px"
          >
            <ArrowRightLeft color={theme?.text} />
          </VStack>
        </HStack>
      </VStack>
      <ModalFilter
        filterMethods={filterMethods}
        hasFilter={hasFilter}
        onSubmit={handleExecute}
        {...filterModal}
      />
    </BackgroundContainer>
  );
};
