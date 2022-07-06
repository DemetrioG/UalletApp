import * as React from "react";
import { TouchableOpacity, Animated, Platform, FlatList } from "react-native";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import LottieView from "lottie-react-native";

import firebase from "../../services/firebase";
import Filter from "../../components/Filter";
import { UserContext } from "../../context/User/userContext";
import { DateContext } from "../../context/Date/dateContext";
import { DataContext } from "../../context/Data/dataContext";
import {
  convertDateToDatabase,
  dateMonthNumber,
  getFinalDateMonth,
  ITimestamp,
} from "../../utils/date.helper";
import { numberToReal } from "../../utils/number.helper";
import { sortObjectByKey } from "../../utils/array.helper";
import { colors, metrics } from "../../styles";
import {
  MoreContainer,
  LoadingText,
  InfoContainer,
  TriangleOfToolTip,
  InfoText,
  RemoveFilterContainer,
  RemoveFilterText,
  RemoveFilterButton,
  InfoMonthText,
  HeaderContainer,
  LastEntryText,
  BalanceText,
  TotalLabelText,
  TotalText,
  TotalItemContainer,
  AutoEntryContainer,
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
  StyledButton,
  StyledButtonOutline,
  StyledIcon,
  StyledSwitch,
  TextHeaderScreen,
  ValueContainer,
  ValueText,
  ViewTabContent,
} from "../../styles/general";

export interface IEntryList {
  date: ITimestamp;
  description: string;
  id: number;
  modality: "Real" | "Projetado";
  segment: string | null;
  type: "Receita" | "Despesa";
  value: number;
}

export interface IActiveFilter {
  initialDate: string | null;
  finalDate: string | null;
  description: string | null;
  modality: string | null;
  typeEntry: string | null;
  segment: string | null;
  initialValue: number;
  finalValue: number;
  isFiltered: boolean;
}

const defaultFilter: IActiveFilter = {
  initialDate: null,
  finalDate: null,
  description: null,
  modality: null,
  typeEntry: null,
  segment: null,
  initialValue: 0,
  finalValue: 0,
  isFiltered: false,
};

const EMPTY = require("../../../assets/icons/emptyData.json");
const LOADING = require("../../../assets/icons/blueLoading.json");

export default function Entry() {
  const { user } = React.useContext(UserContext);
  const { date } = React.useContext(DateContext);
  const { data, setData } = React.useContext(DataContext);
  const { navigate } = useNavigation<NativeStackNavigationProp<any>>();

  const [SWITCH, setSWITCH] = React.useState<boolean>(false);
  const [info, setInfo] = React.useState<boolean>(false);
  const [entryList, setEntryList] = React.useState<
    Array<IEntryList | firebase.firestore.DocumentData>
  >([]);
  const [entryTotal, setEntryTotal] = React.useState("R$0,00");
  const [emptyData, setEmptyData] = React.useState<boolean>(false);
  const [filter, setFilter] = React.useState(defaultFilter);
  const [filterVisible, setFilterVisible] = React.useState(false);

  const opacity = React.useRef(new Animated.Value(0)).current;
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
            {item.description.length > 18
              ? `${item.description.slice(0, 18)}...`
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
          <TouchableOpacity onPress={() => navigate("NovoLançamento", item)}>
            <StyledIcon name="more-horizontal" size={15} />
          </TouchableOpacity>
        </MoreContainer>
      </ItemContainer>
    );
  }

  function infoFade() {
    if (!info) {
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
      setInfo(true);
    } else {
      Animated.timing(opacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
      setInfo(false);
    }
  }

  React.useEffect(() => {
    if (isFocused) {
      (async function getEntry({
        description,
        finalDate,
        finalValue,
        initialDate,
        initialValue,
        isFiltered,
        modality,
        segment,
        typeEntry,
      }: IActiveFilter) {
        setEntryList([]);
        setEmptyData(false);
        if (!isFiltered) {
          // Pega o mês de referência do App para realizar a busca dos registros
          const initialDate = new Date(
            `${date.month}/01/${date.year} 00:00:00`
          );
          const finalDate = new Date(
            `${date.month}/${getFinalDateMonth(date.month, date.year)}/${
              date.year
            } 23:59:59`
          );

          // Busca os registros dentro do período de referência
          firebase
            .firestore()
            .collection("entry")
            .doc(user.uid)
            .collection(date.modality)
            .where("date", ">=", initialDate)
            .where("date", "<=", finalDate)
            .orderBy("date", "desc")
            .get()
            .then((snapshot) => {
              if (snapshot.docs.length > 0) {
                const list: typeof entryList = [];
                snapshot.forEach((result) => {
                  list.push(result.data());
                });
                setEntryList(() => sortObjectByKey(list, "id", "desc"));
              } else {
                setEmptyData(true);
              }
            });
        } else {
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
                        setEntryList((oldArray: any) => [
                          ...oldArray,
                          result.data(),
                        ]);
                      }
                      index++;
                      add++;
                    }
                  } else if (finalValue > 0 && initialValue === 0) {
                    if (value <= finalValue) {
                      if (index === 0) {
                        setEntryList([result.data()]);
                      } else {
                        setEntryList((oldArray: any) => [
                          ...oldArray,
                          result.data(),
                        ]);
                      }
                      index++;
                      add++;
                    }
                  } else {
                    if (value >= initialValue && value <= finalValue) {
                      if (index === 0) {
                        setEntryList([result.data()]);
                      } else {
                        setEntryList((oldArray: any) => [
                          ...oldArray,
                          result.data(),
                        ]);
                      }
                      index++;
                      add++;
                    }
                  }
                } else {
                  if (index === 0) {
                    setEntryList([result.data()]);
                  } else {
                    setEntryList((oldArray: any) => [
                      ...oldArray,
                      result.data(),
                    ]);
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
      })(filter);
    }
  }, [date.modality, date.month, date.year, filter, isFocused]);

  React.useEffect(() => {
    // Retorna o Saldo atual
    (function getBalance() {
      if (date.month) {
        firebase
          .firestore()
          .collection("balance")
          .doc(user.uid)
          .collection(date.modality)
          .doc(date.month.toString())
          .onSnapshot((snapshot) => {
            setData((dataState) => ({
              ...dataState,
              balance: snapshot.data()
                ? numberToReal(snapshot.data()?.balance)
                : "R$ 0,00",
            }));
          });
      }
    })();
  }, [date.modality, date.month, date.year]);

  React.useEffect(() => {
    (() => {
      let total = 0;
      entryList.map(({ value, type }) => {
        type === "Receita" ? (total += value) : (total -= value);
      });
      setEntryTotal(numberToReal(total));
    })();
  }, [entryList]);

  return (
    <ViewTabContent>
      <HeaderContainer>
        <TextHeaderScreen>Lançamentos</TextHeaderScreen>
        <InfoMonthText>
          {dateMonthNumber("toMonth", date.month, "pt", true)}
        </InfoMonthText>
      </HeaderContainer>
      <ButtonHeaderView>
        <StyledButtonOutline
          small={true}
          onPress={() => setFilterVisible(true)}
        >
          <ButtonOutlineText>FILTROS</ButtonOutlineText>
        </StyledButtonOutline>
        <Filter
          visible={filterVisible}
          setVisible={setFilterVisible}
          type="entry"
          filter={filter}
          setFilter={setFilter}
        />
        <StyledButton small={true} onPress={() => navigate("NovoLançamento")}>
          <ButtonText>NOVO</ButtonText>
        </StyledButton>
      </ButtonHeaderView>
      {filter.isFiltered && (
        <RemoveFilterContainer>
          <RemoveFilterButton onPress={handleRemoveFilter}>
            <RemoveFilterText>Remover filtros</RemoveFilterText>
            <StyledIcon name="x" size={20} colorVariant="red" />
          </RemoveFilterButton>
        </RemoveFilterContainer>
      )}
      <LastEntryText>Últimos lançamentos</LastEntryText>
      {emptyData && <LoadingText>Seus lançamentos aparecerão aqui</LoadingText>}
      {!emptyData && (
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
      <TotalItemContainer>
        <TotalLabelText>Total detalhado</TotalLabelText>
        <TotalValueContainer>
          <TotalText>{entryTotal}</TotalText>
        </TotalValueContainer>
      </TotalItemContainer>
      <TotalItemContainer>
        <TotalLabelText>Saldo atual</TotalLabelText>
        <TotalValueContainer>
          <BalanceText negative={data.balance.includes("-")}>
            {!user.hideNumbers ? data.balance : "** ** ** ** **"}
          </BalanceText>
        </TotalValueContainer>
      </TotalItemContainer>
      <AutoEntryContainer>
        <TextHeaderScreen
          style={{ marginTop: Platform.OS === "ios" ? 13 : 10 }}
        >
          Lançamentos automáticos
        </TextHeaderScreen>
        <StyledSwitch
          value={SWITCH}
          onChange={() => setSWITCH(!SWITCH)}
          style={
            Platform.OS === "ios" && {
              transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }],
            }
          }
        />
        <StyledIcon
          name="info"
          color={colors.gray}
          style={{ marginLeft: metrics.baseMargin }}
          onPress={infoFade}
        />
        <InfoContainer style={{ opacity }}>
          <TriangleOfToolTip />
          <InfoText>Integre seu app com suas contas bancárias</InfoText>
        </InfoContainer>
      </AutoEntryContainer>
    </ViewTabContent>
  );
}
