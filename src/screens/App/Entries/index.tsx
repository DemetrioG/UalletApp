import { useEffect, useState, useContext } from "react";
import { useTheme } from "styled-components";
import { Button, Center, HStack, Pressable, Text, VStack } from "native-base";
import { ChevronLeft, Filter, FilterX, InfoIcon } from "lucide-react-native";
import { FlatList } from "react-native";
import LottieView from "lottie-react-native";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import Icon from "../../../components/Icon";
import Tooltip from "../../../components/Tooltip";
import When from "../../../components/When";
import { CardDownIcon, CardUpIcon } from "../../../components/CustomIcons";
import { defaultFilter, IActiveFilter } from "./Filter/helper";
import firebase from "../../../services/firebase";
import { DataContext } from "../../../context/Data/dataContext";
import { useGetBalance } from "../../../hooks/useBalance";
import { useGetEntries } from "./hooks/useEntries";
import { numberToReal } from "../../../utils/number.helper";
import { ListEntries } from "./types";

import { MoreContainer } from "./styles";
import {
  DescriptionContainer,
  DescriptionText,
  ItemContainer,
  ValueContainer,
  ValueText,
  BackgroundContainer,
} from "../../../styles/general";
import { metrics } from "../../../styles";
import { IThemeProvider } from "../../../styles/baseTheme";

import EmptyAnimation from "../../../../assets/icons/emptyData.json";
import LoadingAnimation from "../../../../assets/icons/blueLoading.json";
import { DataGrid } from "../../../components/DataGrid";
import { DataGridColumnRef } from "../../../components/DataGrid/types";

export const Entries = ({
  route: { params },
}: {
  route: { params: IActiveFilter };
}) => {
  const { theme }: IThemeProvider = useTheme();
  const { data } = useContext(DataContext);
  const { navigate, goBack } = useNavigation<NativeStackNavigationProp<any>>();

  const [filter, setFilter] = useState(defaultFilter);

  const { handleGetBalance } = useGetBalance();
  const {
    isLoading,
    isEmpty,
    data: list,
    handleGetData,
  } = useGetEntries({
    server: { filters: filter },
  });

  const credits = list.filter((item) => item.type === "Receita");
  const debits = list.filter((item) => item.type === "Despesa");
  const totalCredits = credits.reduce((total, item) => total + item.value, 0);
  const totalDebits = debits.reduce((total, item) => total + item.value, 0);

  const isFocused = useIsFocused();

  useEffect(() => {
    handleGetData();
  }, [data.modality, data.month, data.year, filter, isFocused]);

  useEffect(() => {
    handleGetBalance();
  }, [data.modality, data.month]);

  useEffect(() => {
    params && setFilter(params);
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
            onPress={() => navigate("Lancamentos/Filtros", filter)}
          >
            <When is={!filter.isFiltered}>
              <Filter color={theme?.blue} size={16} />
            </When>
            <When is={filter.isFiltered}>
              <FilterX color={theme?.blue} size={16} />
            </When>
          </Button>
          <Button
            minW="0px"
            minH="0px"
            w="110px"
            p={0}
            onPress={() => navigate("Lancamentos/NovoLancamento")}
          >
            <Text fontSize="14px" color="#FFF">
              Novo
            </Text>
          </Button>
        </HStack>
        <When is={!!list.length}>
          {/* <FlatList
            data={list}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              // <ItemList item={item} navigate={navigate as () => void} />
            )}
          /> */}
          <DataGrid columns={columns} data={list} height={300} />
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
        <When is={isEmpty}>
          <Center flex={1}>
            <LottieView
              source={EmptyAnimation}
              autoPlay={true}
              loop={false}
              style={{ width: 230 }}
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
    </BackgroundContainer>
  );
};

const columns: DataGridColumnRef[] = [
  {
    name: "description",
    label: "Descrição",
    flex: 1,
    headerAlign: "center",
    align: "center",
  },
  // {
  //   name: "date",
  //   label: "Data",
  //   flex: 1,
  //   headerAlign: "center",
  // },
  {
    name: "value",
    label: "Valor",
    flex: 1,
    headerAlign: "center",
    align: "center",
  },
];

function ItemList({
  item,
  navigate,
}: {
  item: ListEntries | firebase.firestore.DocumentData;
  navigate: (url: string, params?: any) => void;
}) {
  return (
    <ItemContainer>
      <DescriptionContainer>
        <DescriptionText>
          {item.description.length > 17
            ? `${item.description.slice(0, 17)}...`
            : item.description}
        </DescriptionText>
      </DescriptionContainer>
      <ValueContainer>
        <ValueText type={item.type}>
          {item.type == "Receita" ? "+R$" : "-R$"}
        </ValueText>
        <ValueText type={item.type}>{numberToReal(item.value, true)}</ValueText>
      </ValueContainer>
      <MoreContainer>
        <Icon
          name="more-horizontal"
          size={16}
          onPress={() => navigate("Lancamentos/NovoLancamento", item)}
        />
      </MoreContainer>
    </ItemContainer>
  );
}
