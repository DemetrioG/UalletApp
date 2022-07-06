import * as React from "react";
import { View, TouchableOpacity } from "react-native";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import firebase from "../../services/firebase";
import { IEntryList } from "../Entry";
import Consolidate from "../../components/Consolidate";
import Header from "../../components/Header";
import Alert from "../../components/Alert";
import SegmentChart from "../../components/SegmentChart";
import LineChart from "../../components/LineChart";
import { UserContext } from "../../context/User/userContext";
import { DateContext } from "../../context/Date/dateContext";
import { LoaderContext } from "../../context/Loader/loaderContext";
import { DataContext } from "../../context/Data/dataContext";
import { numberToReal } from "../../utils/number.helper";
import { sortObjectByKey } from "../../utils/array.helper";
import { getAtualDate, getFinalDateMonth } from "../../utils/date.helper";
import {
  Balance,
  CardFooterText,
  CardHeaderText,
  CardHeaderView,
  CardStatusView,
  CardTextView,
  Invest,
  InvestPercentual,
  LogoCard,
  Section,
  SectionText,
  StatusPercentText,
  StatusText,
  ValueContainer,
  DescriptionContainer,
  DescriptionText,
} from "./styles";
import {
  BackgroundContainer,
  Card,
  ItemContainer,
  ScrollViewTab,
  StyledIcon,
  StyledLoader,
  ValueText,
} from "../../styles/general";

const LOGO_SMALL = require("../../../assets/images/logoSmall.png");

function ItemList({
  item,
}: {
  item: IEntryList | firebase.firestore.DocumentData;
}) {
  return (
    <ItemContainer>
      <DescriptionContainer>
        <DescriptionText>
          {item.description.length > 22
            ? `${item.description.slice(0, 22)}...`
            : item.description}
        </DescriptionText>
      </DescriptionContainer>
      <ValueContainer>
        <ValueText type={item.type}>
          {item.type == "Receita" ? "+R$" : "-R$"}
        </ValueText>
        <ValueText type={item.type}>{numberToReal(item.value, true)}</ValueText>
      </ValueContainer>
    </ItemContainer>
  );
}

export default function Home() {
  const isFocused = useIsFocused();
  const { navigate } = useNavigation<NativeStackNavigationProp<any>>();
  const { user, setUser } = React.useContext(UserContext);
  const { loader, setLoader } = React.useContext(LoaderContext);
  const { data, setData } = React.useContext(DataContext);
  const { date } = React.useContext(DateContext);
  const [consolidate, setConsolidate] = React.useState(false);
  const [lastEntry, setLastEntry] = React.useState<
    Array<IEntryList | firebase.firestore.DocumentData>
  >([]);

  React.useEffect(() => {
    // Verifica se há despesas projetadas para consolidar na data atual
    (async () => {
      const date = getAtualDate();
      const initialDate = date[1];
      const finalDate = date[2];

      await firebase
        .firestore()
        .collection("entry")
        .doc(user.uid)
        .collection("Projetado")
        .where("date", ">=", initialDate)
        .where("date", "<=", finalDate)
        .where("consolidated.wasActionShown", "==", false)
        .get()
        .then((v) => {
          v.forEach((result) => {
            result.data() && setConsolidate(true);
          });
        });
    })();

    if (!user.complete) {
      // Verifica se o usuário está com todos os dados completos. Se não, envia para tela de cadastro
      (async function completeData() {
        await firebase
          .firestore()
          .collection("users")
          .doc(user.uid)
          .get()
          .then((v) => {
            setUser((userState) => ({
              ...userState,
              complete: true,
            }));
            // Verifica se tem todas as informações de usuário preenchidas no banco, se não, builda a tela de preenchimento
            if (!v.data()?.birthDate) {
              navigate("Complete");
            }
          });
      })();
    }
  }, []);

  React.useEffect(() => {
    // Retorna o Saldo atual
    (function getBalance() {
      if (date.year !== 0) {
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

        !loader.balance &&
          setLoader((loaderState) => ({
            ...loaderState,
            balance: true,
          }));
      }
    })();
  }, [date]);

  React.useEffect(() => {
    //Retorna os últimos lançamentos financeiros no app
    (async function getLastEntry() {
      if (date.year !== 0) {
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
          .limit(4)
          .get()
          .then((snapshot) => {
            if (snapshot.docs.length > 0) {
              const list: typeof lastEntry = [];
              snapshot.forEach((result) => {
                list.push(result.data());
              });
              setLastEntry(() => sortObjectByKey(list, "id", "desc"));
            }
          });
      }
    })();
  }, [isFocused, date]);

  React.useEffect(() => {
    if (
      loader.name &&
      loader.balance &&
      loader.lineChart &&
      loader.segmentChart &&
      loader.visible
    ) {
      setLoader((loaderState) => ({
        ...loaderState,
        visible: false,
      }));
    }
  }, [loader]);

  return (
    <BackgroundContainer>
      <Consolidate visible={consolidate} setVisible={setConsolidate} />
      <Alert />
      <Header />
      <ScrollViewTab showsVerticalScrollIndicator={false}>
        <Section>
          <SectionText>Finanças</SectionText>
          <StyledIcon name="chevron-down" colorVariant="tertiary" />
        </Section>
        <Card>
          <CardHeaderView balance>
            <CardTextView>
              <CardHeaderText>Saldo atual</CardHeaderText>
            </CardTextView>
            <View>
              <LogoCard source={LOGO_SMALL} width={1} />
            </View>
          </CardHeaderView>
          {loader.visible ? (
            <StyledLoader width={160} height={30} radius={10} />
          ) : (
            <Balance negative={data.balance?.includes("-")}>
              {!user.hideNumbers ? data.balance : "** ** ** ** **"}
            </Balance>
          )}
        </Card>
        <Card>
          <CardHeaderView>
            <CardTextView>
              <CardHeaderText>Últimos lançamentos</CardHeaderText>
            </CardTextView>
            <TouchableOpacity onPress={() => navigate("LançamentosTab")}>
              <StyledIcon name="edit-3" />
            </TouchableOpacity>
          </CardHeaderView>
          {lastEntry.map((item, index) => {
            return <ItemList item={item} key={index} />;
          })}
        </Card>
        <Card>
          <CardStatusView>
            <StatusText bold={true}>Você está indo bem</StatusText>
          </CardStatusView>
          <CardStatusView>
            <StatusText>
              Sua média de gastos variáveis semanal está representando{" "}
              <StatusPercentText>3%</StatusPercentText> de sua renda
            </StatusText>
          </CardStatusView>
          <View>
            <StatusText bold={true}>Continue!! ⚡</StatusText>
          </View>
        </Card>
        <Card>
          <CardHeaderView>
            <CardTextView>
              <CardHeaderText>Receitas x Despesas</CardHeaderText>
            </CardTextView>
          </CardHeaderView>
          <LineChart />
        </Card>
        <Card>
          <CardHeaderView>
            <CardTextView>
              <CardHeaderText>Despesas por segmento</CardHeaderText>
            </CardTextView>
          </CardHeaderView>
          <SegmentChart />
        </Card>
        <Section>
          <SectionText>Investimentos</SectionText>
          <StyledIcon name="chevron-down" colorVariant="tertiary" />
        </Section>
        <Card>
          <CardHeaderView>
            <CardTextView>
              <CardHeaderText>Patrimônio investido</CardHeaderText>
            </CardTextView>
            <TouchableOpacity>
              <StyledIcon name="maximize-2" />
            </TouchableOpacity>
          </CardHeaderView>
          <Invest>
            {!user.hideNumbers ? "R$ 153.000,00" : "** ** ** ** **"}
          </Invest>
          <CardTextView>
            <CardFooterText>Rendimento semanal</CardFooterText>
            <InvestPercentual>55%</InvestPercentual>
            <StyledIcon name="arrow-up" size={15} colorVariant="green" />
          </CardTextView>
        </Card>
      </ScrollViewTab>
    </BackgroundContainer>
  );
}
