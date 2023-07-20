import { useEffect, useContext } from "react";
import { useTheme } from "styled-components";
import {
  Button,
  Center,
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
import { DataGrid } from "../../../components/DataGrid";
import { DataGridColumnRef } from "../../../components/DataGrid/types";
import {
  ITimestamp,
  convertDateFromDatabase,
} from "../../../utils/date.helper";
import { ModalFilter } from "./ModalFilter";
import { useFilters } from "../../../hooks/useFilters";
import { ServerFilterFields } from "./ModalFilter/types";

export const Entries = () => {
  const { theme }: IThemeProvider = useTheme();
  const { data } = useContext(DataContext);
  const { navigate, goBack } = useNavigation<NativeStackNavigationProp<any>>();

  const isFocused = useIsFocused();
  const filterModal = useDisclose();
  const { filterMethods, clientFilters, serverFilters, hasFilter } =
    useFilters<ListEntries>();

  const {} = useGetBalance();
  const {
    isLoading,
    data: list,
    handleGetData,
  } = useGetEntries({
    server: { filters: serverFilters as ServerFilterFields },
  });

  useEffect(() => {
    handleGetData();
  }, [data.modality, data.month, data.year, isFocused]);

  const filtered = list.filter(clientFilters);

  const credits = filtered.filter((item) => item.type === "Receita");
  const debits = filtered.filter((item) => item.type === "Despesa");
  const totalCredits = credits.reduce((total, item) => total + item.value, 0);
  const totalDebits = debits.reduce((total, item) => total + item.value, 0);

  const columns: DataGridColumnRef<ListEntries>[] = [
    {
      name: "description",
      label: "Descrição",
      flex: 1,
      headerAlign: "flex-start",
      align: "flex-start",
      RowProps: {
        styles: {
          borderColor: theme?.primary,
        },
      },
    },
    {
      name: "date",
      label: "Data",
      flex: 1,
      headerAlign: "center",
      align: "center",
      valueFormatter: ({ value }) => {
        return convertDateFromDatabase(value as ITimestamp);
      },
      RowProps: {
        styles: {
          borderColor: theme?.primary,
        },
      },
    },
    {
      name: "value",
      label: "Valor",
      flex: 1,
      headerAlign: "flex-end",
      align: "flex-end",
      valueFormatter: ({ row, value }) => {
        return `${row.type === "Receita" ? "+" : "-"}${numberToReal(
          value as number
        )}`;
      },
      RowProps: {
        styles: {
          borderColor: theme?.primary,
        },
      },
    },
  ];

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
            onPress={() => navigate("Lancamentos/Form")}
          >
            <Text fontSize="14px" color="white">
              Novo
            </Text>
          </Button>
        </HStack>
        <When is={!isLoading}>
          <DataGrid
            columns={columns}
            data={filtered}
            height="60%"
            onRowPress={(_, row) => navigate("Lancamentos/Form", row)}
          />
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
              borderRadius="100px"
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
            borderRadius="100px"
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
