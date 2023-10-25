import { useEffect, useContext } from "react";
import { ActivityIndicator } from "react-native";
import { useTheme } from "styled-components";
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
import { ChevronLeft, Filter, InfoIcon } from "lucide-react-native";
import LottieView from "lottie-react-native";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import Tooltip from "../../../components/Tooltip";
import When from "../../../components/When";
import { CardDownIcon, CardUpIcon } from "../../../components/CustomIcons";
import { DataContext } from "../../../context/Data/dataContext";
import { useGetBalance } from "../../../hooks/useBalance";
import { useGetEntries } from "./hooks/useEntries";
import { numberToReal } from "../../../utils/number.helper";
import { ListEntries } from "./types";

import { BackgroundContainer } from "../../../styles/general";
import { metrics } from "../../../styles";
import { IThemeProvider } from "../../../styles/baseTheme";

import LoadingAnimation from "../../../../assets/icons/blueLoading.json";
import { ModalFilter } from "./ModalFilter";
import { useFilters } from "../../../hooks/useFilters";
import { ServerFilterFields } from "./ModalFilter/types";
import { Item } from "./Item";
import { Toggle } from "../../../components/Toggle";
import { useWatch } from "react-hook-form";

export const Entries = () => {
  const { theme }: IThemeProvider = useTheme();
  const { data } = useContext(DataContext);
  const { navigate, goBack } = useNavigation<NativeStackNavigationProp<any>>();

  const isFocused = useIsFocused();
  const filterModal = useDisclose();
  const { filterMethods, clientFilters, serverFilters, hasFilter } =
    useFilters<ListEntries>({
      server: {
        period: "period",
      },
    });

  const period = useWatch({
    control: filterMethods.control,
    name: "server.period",
  });

  const {} = useGetBalance();
  const {
    isLoading,
    isLoadingMore,
    data: list,
    lastVisible,
    isLastPage,
    handleGetData,
    totalCredits,
    totalDebits,
  } = useGetEntries({
    server: { filters: serverFilters as ServerFilterFields },
  });

  useEffect(() => {
    handleGetData();
  }, [data.modality, data.month, data.year, data.trigger, isFocused, period]);

  const filtered = list.filter(clientFilters);

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
            <Text fontWeight={700}>Lançamentos</Text>
          </HStack>
          <Pressable>
            <Tooltip label="Lançamentos realizados no período">
              <InfoIcon color={theme?.text} />
            </Tooltip>
          </Pressable>
        </HStack>
        <HStack space={2} justifyContent="space-between">
          <Toggle
            labels={{ firstLabel: "PERÍODO", secondLabel: "TODOS" }}
            onToggle={(value) => {
              filterMethods.setValue(
                "server.period",
                value === 1 ? "period" : "all"
              );
            }}
          />
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
            onPress={() => navigate("Lancamentos/Form")}
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
                <Text>Não há lançamentos para visualizar</Text>
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
                onEndReachedThreshold={0.2}
                onEndReached={() => {
                  if (!isLastPage && !isLoadingMore) handleGetData(lastVisible);
                }}
                ListFooterComponent={() => (
                  <VStack p={5} width="100%" alignItems="center" opacity={0.5}>
                    {isLoadingMore && <ActivityIndicator color={theme?.text} />}
                    {isLastPage && <Text>Não há mais lançamentos</Text>}
                  </VStack>
                )}
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
          zIndex={1}
          backgroundColor={theme?.tertiary}
          position="absolute"
          alignItems="flex-start"
          paddingX={6}
          paddingY={2}
          w={metrics.screenWidth}
          minH="120px"
          left={0}
          bottom={0}
          borderTopLeftRadius="30px"
          borderTopRightRadius="30px"
        >
          <HStack alignItems="center" justifyContent="space-between" w="100%">
            <HStack space={2}>
              <Text>Total débito:</Text>
              <Text>{numberToReal(totalDebits)}</Text>
            </HStack>
            <VStack
              backgroundColor={theme?.primary}
              alignItems="center"
              justifyContent="center"
              p={1}
              pl={2}
              borderRadius={50}
              h="45px"
              w="45px"
            >
              <CardDownIcon />
            </VStack>
          </HStack>
        </HStack>
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
            <Text>Total crédito:</Text>
            <Text>{numberToReal(totalCredits)}</Text>
          </HStack>
          <VStack
            backgroundColor={theme?.tertiary}
            alignItems="center"
            justifyContent="center"
            p={1}
            pl={2}
            borderRadius={50}
            h="45px"
            w="45px"
          >
            <CardUpIcon />
          </VStack>
        </HStack>
      </VStack>
      <ModalFilter
        filterMethods={filterMethods}
        hasFilter={hasFilter}
        onSubmit={handleGetData}
        {...filterModal}
      />
    </BackgroundContainer>
  );
};
