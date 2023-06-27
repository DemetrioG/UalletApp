import * as React from "react";
import { FlatList } from "react-native";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import LottieView from "lottie-react-native";

import firebase from "../../../services/firebase";
import { UserContext } from "../../../context/User/userContext";
import { DataContext } from "../../../context/Data/dataContext";
import { convertDateToDatabase } from "../../../utils/date.helper";
import { numberToReal } from "../../../utils/number.helper";
import { sortObjectByKey } from "../../../utils/array.helper";
import { defaultFilter, IActiveFilter } from "./Filter/helper";
import { MoreContainer } from "./styles";
import {
  ContainerCenter,
  DescriptionContainer,
  DescriptionText,
  ItemContainer,
  ValueContainer,
  ValueText,
  BackgroundContainer,
} from "../../../styles/general";
import Icon from "../../../components/Icon";
import { getEntries } from "./querys";
import { Button, HStack, Pressable, Text, VStack } from "native-base";
import { metrics } from "../../../styles";
import { IThemeProvider } from "../../../styles/baseTheme";
import { useTheme } from "styled-components";
import { ChevronLeft, Filter, FilterX } from "lucide-react-native";
import Tooltip from "../../../components/Tooltip";
import { InfoIcon } from "lucide-react-native";
import When from "../../../components/When";
import { CardDownIcon, CardUpIcon } from "../../../components/CustomIcons";
import { ListEntries } from "./types";
import { useGetBalance } from "../../../hooks/useBalance";

const EMPTY = require("../../../../assets/icons/emptyData.json");
const LOADING = require("../../../../assets/icons/blueLoading.json");

export const Entries = ({
  route: { params },
}: {
  route: { params: IActiveFilter };
}) => {
  const { theme }: IThemeProvider = useTheme();
  const { user } = React.useContext(UserContext);
  const { data } = React.useContext(DataContext);
  const { navigate, goBack } = useNavigation<NativeStackNavigationProp<any>>();

  const { handleGetBalance } = useGetBalance();

  const [entryList, setEntryList] = React.useState<
    Array<ListEntries | firebase.firestore.DocumentData>
  >([]);
  const [entryTotal, setEntryTotal] = React.useState("R$0,00");
  const [emptyData, setEmptyData] = React.useState<boolean>(false);
  const [filter, setFilter] = React.useState(defaultFilter);

  const isFocused = useIsFocused();

  function handleRemoveFilter() {
    setFilter(() => ({
      ...defaultFilter,
    }));
  }

  function ItemList({
    item,
  }: {
    item: ListEntries | firebase.firestore.DocumentData;
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
          <ValueText type={item.type}>
            {numberToReal(item.value, true)}
          </ValueText>
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

  async function getEntry(props: IActiveFilter) {
    const {
      description,
      finalDate,
      finalValue,
      initialDate,
      initialValue,
      isFiltered,
      modality,
      segment,
      typeEntry,
    } = props;
    setEntryList([]);
    setEmptyData(false);
    if (!isFiltered) {
      const snapshot = await getEntries({ ...data });
      if (!snapshot.docs.length) {
        setEmptyData(true);
        return;
      }
      const list = snapshot.docs.map((doc) => doc.data());
      setEntryList(() => sortObjectByKey(list, "id", "desc"));
      return;
    }
    let baseQuery: firebase.firestore.Query = firebase
      .firestore()
      .collection("entry")
      .doc(user.uid)
      .collection(modality!);
    if (description) {
      baseQuery = baseQuery.where("description", "==", description);
    }
    if (segment) {
      baseQuery = baseQuery.where("segment", "==", segment);
    }
    if (typeEntry) {
      baseQuery = baseQuery.where("type", "==", typeEntry);
    }
    if (initialDate) {
      baseQuery = baseQuery.where(
        "date",
        ">=",
        convertDateToDatabase(initialDate)
      );
    }
    if (finalDate) {
      baseQuery = baseQuery.where(
        "date",
        "<=",
        convertDateToDatabase(finalDate)
      );
    }
    if (initialValue > 0 && !initialDate) {
      baseQuery = baseQuery.where("value", ">=", initialValue);
    }
    if (finalValue > 0 && !finalDate) {
      baseQuery = baseQuery.where("value", "<=", finalValue);
    }
    const snapshot = await baseQuery.get();
    if (snapshot.docs.length === 0) {
      setEmptyData(true);
      return;
    }
    const list = snapshot.docs.map((doc) => doc.data());
    if (initialValue > 0 || finalValue > 0 || initialDate || finalDate) {
      const filteredList = list.filter((entry) => {
        const entryValue = entry.value || 0;
        const entryDate = entry.date || new Date(0).toISOString();
        const inValueRange =
          (!initialValue || entryValue >= initialValue) &&
          (!finalValue || entryValue <= finalValue);
        const inDateRange =
          (!initialDate || entryDate >= initialDate) &&
          (!finalDate || entryDate <= finalDate);
        return inValueRange && inDateRange;
      });
      if (filteredList.length === 0) {
        setEmptyData(true);
        return;
      }
      setEntryList(() => sortObjectByKey(filteredList, "id", "desc"));
    } else {
      setEntryList(() => sortObjectByKey(list, "id", "desc"));
    }
  }

  React.useEffect(() => {
    getEntry(filter);
  }, [data.modality, data.month, data.year, filter, isFocused]);

  React.useEffect(() => {
    handleGetBalance();
  }, [data.modality, data.month]);

  React.useEffect(() => {
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
        {entryList.length > 0 ? (
          <FlatList
            data={entryList}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => <ItemList item={item} />}
          />
        ) : (
          <ContainerCenter>
            {!emptyData ? (
              <LottieView
                source={LOADING}
                autoPlay={true}
                loop={true}
                style={{ width: 50 }}
              />
            ) : (
              <LottieView
                source={EMPTY}
                autoPlay={true}
                loop={false}
                style={{ width: 230 }}
              />
            )}
          </ContainerCenter>
        )}
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
              <Text>R$2.750,00</Text>
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
            <Text>R$3.500,00</Text>
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
