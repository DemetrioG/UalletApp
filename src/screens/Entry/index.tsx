import * as React from "react";
import { FlatList } from "react-native";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import LottieView from "lottie-react-native";

import firebase from "../../services/firebase";
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
import { defaultFilter, IActiveFilter } from "./Filter/helper";
import {
  MoreContainer,
  LoadingText,
  RemoveFilterText,
  RemoveFilterButton,
  InfoMonthText,
  HeaderContainer,
  LastEntryText,
  BalanceText,
  TotalLabelText,
  TotalText,
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
  ViewTabContent,
  ButtonOutlineSmall,
  ButtonSmall,
} from "../../styles/general";
import Icon from "../../components/Icon";

export interface IEntryList {
  date: ITimestamp;
  description: string;
  id: number;
  modality: "Real" | "Projetado";
  segment: string | null;
  type: "Receita" | "Despesa";
  value: number;
}

const EMPTY = require("../../../assets/icons/emptyData.json");
const LOADING = require("../../../assets/icons/blueLoading.json");

const Entry = ({ route: { params } }: { route: { params: IActiveFilter } }) => {
  const { user } = React.useContext(UserContext);
  const { date } = React.useContext(DateContext);
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
          <Icon
            name="more-horizontal"
            size={16}
            onPress={() => navigate("NovoLançamento", item)}
          />
        </MoreContainer>
      </ItemContainer>
    );
  }

  React.useEffect(() => {
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
        const initialDate = new Date(`${date.month}/01/${date.year} 00:00:00`);
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
    })(filter);
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

  React.useEffect(() => {
    params && setFilter(params);
  }, [isFocused]);

  return (
    <ViewTabContent>
      <HeaderContainer>
        <TextHeaderScreen>Lançamentos</TextHeaderScreen>
        <InfoMonthText>
          {dateMonthNumber("toMonth", date.month, true)}
        </InfoMonthText>
      </HeaderContainer>
      <ButtonHeaderView>
        <ButtonOutlineSmall onPress={() => navigate("Filtros", filter)}>
          <ButtonOutlineText>FILTROS</ButtonOutlineText>
        </ButtonOutlineSmall>
        <ButtonSmall onPress={() => navigate("NovoLançamento")}>
          <ButtonText>NOVO</ButtonText>
        </ButtonSmall>
      </ButtonHeaderView>
      {filter.isFiltered && (
        <RemoveFilterButton onPress={handleRemoveFilter}>
          <RemoveFilterText>Remover filtros</RemoveFilterText>
          <Icon name="x" size={20} colorVariant="red" />
        </RemoveFilterButton>
      )}
      <LastEntryText>Últimos lançamentos</LastEntryText>
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
    </ViewTabContent>
  );
};

export default Entry;
