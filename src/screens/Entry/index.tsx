import * as React from "react";
import { TouchableOpacity, Animated, Platform, FlatList } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import LottieView from "lottie-react-native";

import firebase from "../../services/firebase";
import { UserContext } from "../../context/User/userContext";
import { DateContext } from "../../context/Date/dateContext";
import { sleep, getFinalDateMonth, numberToReal } from "../../functions/index";
import { ITimestamp } from "../../functions/convertDateFromDatabase";
import { colors, metrics } from "../../styles";
import {
  ItemView,
  DescriptionView,
  DescriptionText,
  ValueView,
  ValueText,
  MoreView,
  LoadingText,
  IncomeView,
  IncomeText,
  AutoEntryView,
  InfoView,
  TriangleOfToolTip,
  InfoText,
  RemoveFilterContainer,
  RemoveFilterText,
  RemoveFilterButton,
} from "./styles";
import {
  ButtonHeaderView,
  ButtonOutlineText,
  ButtonText,
  ContainerCenter,
  Label,
  SpaceAroundView,
  StyledButton,
  StyledButtonOutline,
  StyledIcon,
  StyledSwitch,
  TextHeaderScreen,
  ViewTabContent,
} from "../../styles/general";
import Filter from "../../components/Filter";

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

export default function Entry() {
  const { user } = React.useContext(UserContext);
  const { date } = React.useContext(DateContext);
  const { navigate } = useNavigation<NativeStackNavigationProp<any>>();

  const [SWITCH, setSWITCH] = React.useState<boolean>(false);
  const [info, setInfo] = React.useState<boolean>(false);
  const [entryList, setEntryList] = React.useState<Array<IEntryList>>([]);
  const [emptyData, setEmptyData] = React.useState<boolean>(false);
  const [balance, setBalance] = React.useState<string>("R$ 0,00");
  const [filter, setFilter] = React.useState(false);
  const [isFiltered, setIsFiltered] = React.useState(false);

  const opacity = React.useRef(new Animated.Value(0)).current;

  async function getEntry() {
    // Pega o mês de referência do App para realizar a busca dos registros
    const initialDate = new Date(`${date.month}/01/${date.year} 00:00:00`);
    const finalDate = new Date(
      `${date.month}/${getFinalDateMonth(date.month, date.year)}/${
        date.year
      } 23:59:59`
    );

    // Busca os registros dentro do período de referência
    setEntryList([]);
    setEmptyData(false);
    await sleep(1000);
    firebase
      .firestore()
      .collection("entry")
      .doc(user.uid)
      .collection(date.modality)
      .where("date", ">=", initialDate)
      .where("date", "<=", finalDate)
      .orderBy("date", "desc")
      .onSnapshot((snapshot) => {
        if (snapshot.docs.length > 0) {
          snapshot.forEach((result) => {
            setEntryList((oldArray: any) => [...oldArray, result.data()]);
          });
        } else {
          setEmptyData(true);
        }
      });
  }

  // Retorna o Saldo atual
  function getBalance() {
    if (date.month) {
      firebase
        .firestore()
        .collection("balance")
        .doc(user.uid)
        .collection(date.modality)
        .doc(date.month.toString())
        .onSnapshot((snapshot) => {
          if (snapshot.data()) {
            setBalance(numberToReal(snapshot.data()?.balance));
          } else {
            setBalance("R$ 0,00");
          }
        });
    }
  }

  function handleRemoveFilter() {
    setIsFiltered(false);
    getEntry();
  }

  function ItemList({ item }: { item: IEntryList }) {
    return (
      <ItemView>
        <DescriptionView>
          <DescriptionText>{item.description}</DescriptionText>
        </DescriptionView>
        <ValueView>
          <ValueText type={item.type}>
            {item.type == "Receita" ? "+" : "-"}
          </ValueText>
          <ValueText type={item.type}>{numberToReal(item.value)}</ValueText>
        </ValueView>
        <MoreView>
          <TouchableOpacity onPress={() => navigate("NovoLançamento", item)}>
            <StyledIcon name="more-horizontal" size={15} />
          </TouchableOpacity>
        </MoreView>
      </ItemView>
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
    getEntry();
    getBalance();
  }, [date.modality, date.month, date.year]);

  return (
    <ViewTabContent>
      <TextHeaderScreen>Lançamentos</TextHeaderScreen>
      <ButtonHeaderView>
        <StyledButtonOutline small={true} onPress={() => setFilter(true)}>
          <ButtonOutlineText>FILTROS</ButtonOutlineText>
        </StyledButtonOutline>
        <Filter
          visible={filter}
          setVisible={setFilter}
          type="entry"
          setList={setEntryList}
          empty={setEmptyData}
          isFiltered={isFiltered}
          setIsFiltered={setIsFiltered}
        />
        <StyledButton small={true} onPress={() => navigate("NovoLançamento")}>
          <ButtonText>NOVO</ButtonText>
        </StyledButton>
      </ButtonHeaderView>
      {isFiltered && (
        <RemoveFilterContainer>
          <RemoveFilterButton onPress={handleRemoveFilter}>
            <RemoveFilterText>Remover filtros</RemoveFilterText>
            <StyledIcon name="x" size={20} colorVariant="red" />
          </RemoveFilterButton>
        </RemoveFilterContainer>
      )}
      <TextHeaderScreen>Últimos lançamentos</TextHeaderScreen>
      {emptyData && <LoadingText>Seus lançamentos aparecerão aqui</LoadingText>}
      {!emptyData && (
        <SpaceAroundView>
          <Label>Descrição</Label>
          <Label>Valor</Label>
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
      <IncomeView>
        <Label>Saldo atual:</Label>
        <IncomeText>
          {!user.hideNumbers ? balance : "** ** ** ** **"}
        </IncomeText>
      </IncomeView>
      <AutoEntryView>
        <TextHeaderScreen
          style={{ marginTop: Platform.OS === "ios" ? 13 : 10 }}
        >
          Lançamentos automáticos
        </TextHeaderScreen>
        <StyledSwitch value={SWITCH} onChange={() => setSWITCH(!SWITCH)} />
        <StyledIcon
          name="info"
          color={colors.gray}
          style={{ marginLeft: metrics.baseMargin }}
          onPress={infoFade}
        />
        <InfoView style={{ opacity }}>
          <TriangleOfToolTip />
          <InfoText>Integre seu app com suas contas bancárias</InfoText>
        </InfoView>
      </AutoEntryView>
    </ViewTabContent>
  );
}
