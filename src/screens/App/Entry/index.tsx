import * as React from "react";
import { FlatList } from "react-native";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import LottieView from "lottie-react-native";

import firebase from "@services/firebase";
import { UserContext } from "../../../context/User/userContext";
import { DataContext } from "../../../context/Data/dataContext";
import {
  convertDateToDatabase,
  dateMonthNumber,
  ITimestamp,
} from "@utils/date.helper";
import { numberToReal } from "@utils/number.helper";
import { sortObjectByKey } from "@utils/array.helper";
import { defaultFilter, IActiveFilter } from "./Filter/helper";
import {
  MoreContainer,
  LoadingText,
  RemoveFilterButton,
  HeaderContainer,
  BalanceText,
  TotalItemContainer,
  TotalValueContainer,
} from "./styles";
import {
  ButtonHeaderView,
  ButtonOutlineText,
  ButtonText,
  ContainerCenter,
  DescriptionContainer,
  DescriptionText,
  ItemContainer,
  Label,
  SpaceAroundView,
  TextHeaderScreen,
  ValueContainer,
  ValueText,
  ButtonOutlineSmall,
  ButtonSmall,
  ViewTab,
  BackgroundContainer,
} from "@styles/general";
import Icon from "../../../components/Icon";
import { getEntryList } from "./querys";
import { getBalance } from "@utils/query.helper";
import { Text, VStack } from "native-base";
import { metrics } from "../../../styles";
import { TEntryType } from "../../../types/types";

export interface IEntryList {
  date: ITimestamp;
  description: string;
  id: number;
  modality: "Real" | "Projetado";
  classification: string | null;
  segment: string | null;
  type: TEntryType;
  value: number;
}

const EMPTY = require("../../../../assets/icons/emptyData.json");
const LOADING = require("../../../../assets/icons/blueLoading.json");

const Entry = ({ route: { params } }: { route: { params: IActiveFilter } }) => {
  const { user } = React.useContext(UserContext);
  const { data, setData } = React.useContext(DataContext);
  const { navigate } = useNavigation<NativeStackNavigationProp<any>>();

  const [entryList, setEntryList] = React.useState<
    Array<IEntryList | firebase.firestore.DocumentData>
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
    item: IEntryList | firebase.firestore.DocumentData;
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
      return getEntryList({
        ...data,
      }).then((snapshot) => {
        if (!snapshot.docs.length) return setEmptyData(true);
        const list: typeof entryList = [];
        snapshot.forEach((result) => {
          list.push(result.data());
        });
        setEntryList(() => sortObjectByKey(list, "id", "desc"));
      });
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

    /**
     * O Firebase não permite realizar a query filtrando por data e valor, retornando um erro.
     * Sendo assim, caso o usuário tenha filtrado pelos dois, na query retornamos somente com filtro por data, e pelo código, é filtrado se os valores estão dentro do filtrado.
     */
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

    baseQuery.get().then((snapshot) => {
      if (snapshot.docs.length > 0) {
        let index = 0;
        let add = 0;
        snapshot.forEach((result) => {
          if (
            (initialValue > 0 || finalValue > 0) &&
            (initialDate || finalDate)
          ) {
            const { value } = result.data();
            if (initialValue > 0 && finalValue === 0) {
              if (value >= initialValue) {
                if (index === 0) {
                  setEntryList([result.data()]);
                } else {
                  setEntryList((oldArray: any) => [...oldArray, result.data()]);
                }
                index++;
                add++;
              }
            } else if (finalValue > 0 && initialValue === 0) {
              if (value <= finalValue) {
                if (index === 0) {
                  setEntryList([result.data()]);
                } else {
                  setEntryList((oldArray: any) => [...oldArray, result.data()]);
                }
                index++;
                add++;
              }
            } else {
              if (value >= initialValue && value <= finalValue) {
                if (index === 0) {
                  setEntryList([result.data()]);
                } else {
                  setEntryList((oldArray: any) => [...oldArray, result.data()]);
                }
                index++;
                add++;
              }
            }
          } else {
            if (index === 0) {
              setEntryList([result.data()]);
            } else {
              setEntryList((oldArray: any) => [...oldArray, result.data()]);
            }
            index++;
            add++;
          }
        });

        if (add === 0) {
          setEmptyData(true);
        }
      } else {
        setEmptyData(true);
      }
    });
  }

  React.useEffect(() => {
    getEntry(filter);
  }, [data.modality, data.month, data.year, filter, isFocused]);

  React.useEffect(() => {
    if (!data.month) return;

    getBalance({
      month: data.month,
      year: data.year,
      modality: data.modality,
    }).then((balance) => {
      setData((dataState) => ({
        ...dataState,
        balance,
      }));
    });
  }, [data.modality, data.month, isFocused]);

  React.useEffect(() => {
    let total = 0;
    entryList.forEach(({ value, type }) => {
      type === "Receita" ? (total += value) : (total -= value);
    });

    setEntryTotal(numberToReal(total));
  }, [entryList]);

  React.useEffect(() => {
    params && setFilter(params);
  }, [isFocused]);

  return (
    <BackgroundContainer>
      <ViewTab>
        <HeaderContainer>
          <TextHeaderScreen>Lançamentos</TextHeaderScreen>
          <Text fontWeight={700} fontSize={"md"} ml={2}>
            {dateMonthNumber("toMonth", data.month, true)}
          </Text>
        </HeaderContainer>
        <ButtonHeaderView>
          <ButtonOutlineSmall
            onPress={() => navigate("Lancamentos/Filtros", filter)}
          >
            <ButtonOutlineText>FILTROS</ButtonOutlineText>
          </ButtonOutlineSmall>
          <ButtonSmall onPress={() => navigate("Lancamentos/NovoLancamento")}>
            <ButtonText>NOVO</ButtonText>
          </ButtonSmall>
        </ButtonHeaderView>
        {filter.isFiltered && (
          <RemoveFilterButton onPress={handleRemoveFilter}>
            <Text mr={3}>Remover filtros</Text>
            <Icon name="x" size={20} colorVariant="red" />
          </RemoveFilterButton>
        )}
        <Text fontSize={"md"} mb={metrics.baseMargin}>
          Últimos lançamentos
        </Text>
        {emptyData ? (
          <LoadingText>Seus lançamentos aparecerão aqui</LoadingText>
        ) : (
          <SpaceAroundView>
            <Label>DESCRIÇÃO</Label>
            <Label>VALOR</Label>
          </SpaceAroundView>
        )}
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
        <VStack mb={5}>
          <TotalItemContainer>
            <Text mr={10}>Total detalhado</Text>
            <TotalValueContainer>
              <Text fontFamily={"mono"}>{entryTotal}</Text>
            </TotalValueContainer>
          </TotalItemContainer>
          <TotalItemContainer>
            <Text mr={10}>Saldo atual</Text>
            <TotalValueContainer>
              <BalanceText negative={data.balance.includes("-")}>
                {!user.hideNumbers ? data.balance : "** ** ** ** **"}
              </BalanceText>
            </TotalValueContainer>
          </TotalItemContainer>
        </VStack>
      </ViewTab>
    </BackgroundContainer>
  );
};

export default Entry;
