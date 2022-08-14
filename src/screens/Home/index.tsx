import * as React from "react";
import { View, TouchableOpacity } from "react-native";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import firebase from "../../services/firebase";
import { IEntryList } from "../Entry";
import Consolidate from "../../components/Consolidate";
import SegmentChart from "../../components/SegmentChart";
import LineChart from "../../components/LineChart";
import Icon from "../../components/Icon";
import { UserContext } from "../../context/User/userContext";
import { LoaderContext } from "../../context/Loader/loaderContext";
import { DataContext } from "../../context/Data/dataContext";
import { numberToReal } from "../../utils/number.helper";
import { sortObjectByKey } from "../../utils/array.helper";
import { getAtualDate, getFinalDateMonth } from "../../utils/date.helper";
import {
  CardFooterText,
  CardHeaderText,
  CardHeaderView,
  CardTextView,
  Invest,
  InvestPercentual,
  LogoCard,
  Section,
  SectionText,
  ValueContainer,
  DescriptionContainer,
  DescriptionText,
  EmptyEntryText,
  BackgroundContainer,
  Balance,
} from "./styles";
import {
  Card,
  ItemContainer,
  ScrollViewTab,
  Skeleton,
  ValueText,
} from "../../styles/general";
import { Collapse } from "native-base";

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

const Home = () => {
  const isFocused = useIsFocused();
  const { navigate } = useNavigation<NativeStackNavigationProp<any>>();
  const { user, setUser } = React.useContext(UserContext);
  const { loader, setLoader } = React.useContext(LoaderContext);
  const { data, setData } = React.useContext(DataContext);
  const [consolidate, setConsolidate] = React.useState(false);
  const [financeShow, setFinanceShow] = React.useState(true);
  const [investShow, setInvestShow] = React.useState(true);
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
      if (data.year !== 0) {
        firebase
          .firestore()
          .collection("balance")
          .doc(user.uid)
          .collection(data.modality)
          .doc(data.month.toString())
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
  }, [data.modality, data.month, data.year]);

  React.useEffect(() => {
    //Retorna os últimos lançamentos financeiros no app
    (async function getLastEntry() {
      if (data.year !== 0) {
        // Pega o mês de referência do App para realizar a busca dos registros
        const initialDate = new Date(`${data.month}/01/${data.year} 00:00:00`);
        const finalDate = new Date(
          `${data.month}/${getFinalDateMonth(data.month, data.year)}/${
            data.year
          } 23:59:59`
        );

        // Busca os registros dentro do período de referência
        firebase
          .firestore()
          .collection("entry")
          .doc(user.uid)
          .collection(data.modality)
          .where("date", ">=", initialDate)
          .where("date", "<=", finalDate)
          .orderBy("date", "desc")
          .limit(4)
          .get()
          .then((snapshot) => {
            if (snapshot.docs.length > 0) {
              const list: typeof lastEntry = [];
              snapshot.forEach((result) => {
                console.log(result.data());

                list.push(result.data());
              });
              return setLastEntry(() => sortObjectByKey(list, "id", "desc"));
            } else {
              return setLastEntry([]);
            }
          });
      }
    })();
  }, [isFocused, data.modality, data.month, data.year]);

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
      <ScrollViewTab showsVerticalScrollIndicator={false}>
        <TouchableOpacity onPress={() => setFinanceShow(!financeShow)}>
          <Section>
            <SectionText>Finanças</SectionText>
            <Icon
              name={financeShow ? "chevron-down" : "chevron-right"}
              colorVariant="tertiary"
            />
          </Section>
        </TouchableOpacity>
        <Collapse isOpen={financeShow}>
          <Card>
            <Skeleton isLoaded={!loader.visible} width={"full"} h={69}>
              <CardHeaderView balance>
                <CardTextView>
                  <CardHeaderText>Saldo atual</CardHeaderText>
                </CardTextView>
                <View>
                  <LogoCard source={LOGO_SMALL} width={1} />
                </View>
              </CardHeaderView>
              <Balance negative={data.balance?.includes("-")}>
                {!user.hideNumbers ? data.balance : "** ** ** ** **"}
              </Balance>
            </Skeleton>
          </Card>
          <Card>
            <Skeleton isLoaded={!loader.visible} h={156} width={"full"}>
              {lastEntry.length > 0 ? (
                <>
                  <CardHeaderView>
                    <CardTextView>
                      <CardHeaderText>Últimos lançamentos</CardHeaderText>
                    </CardTextView>
                    <Icon
                      name="edit-3"
                      onPress={() => navigate("LançamentosTab")}
                    />
                  </CardHeaderView>
                  <>
                    {lastEntry.map((item, index) => {
                      return <ItemList item={item} key={index} />;
                    })}
                  </>
                </>
              ) : (
                <EmptyEntryText>
                  Não há lançamentos para visualizar
                </EmptyEntryText>
              )}
            </Skeleton>
          </Card>
          {/* <Card>
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
        </Card> */}
          <Card>
            <Skeleton isLoaded={!loader.visible} h={152} width={"full"}>
              <CardHeaderView>
                <CardTextView>
                  <CardHeaderText>Receitas x Despesas</CardHeaderText>
                </CardTextView>
              </CardHeaderView>
            </Skeleton>
            <LineChart />
          </Card>
          <Card>
            <Skeleton isLoaded={!loader.visible} h={168} width={"full"}>
              <CardHeaderView>
                <CardTextView>
                  <CardHeaderText>Despesas por segmento</CardHeaderText>
                </CardTextView>
              </CardHeaderView>
            </Skeleton>
            <SegmentChart />
          </Card>
        </Collapse>
        <TouchableOpacity onPress={() => setInvestShow(!investShow)}>
          <Section>
            <SectionText>Investimentos</SectionText>
            <Icon
              name={investShow ? "chevron-down" : "chevron-right"}
              colorVariant="tertiary"
            />
          </Section>
        </TouchableOpacity>
        <Collapse isOpen={investShow}>
          <Card>
            <CardHeaderView>
              <CardTextView>
                <CardHeaderText>Patrimônio investido</CardHeaderText>
              </CardTextView>
              <Icon name="maximize-2" />
            </CardHeaderView>
            <Invest>
              {!user.hideNumbers ? "R$ 153.000,00" : "** ** ** ** **"}
            </Invest>
            <CardTextView>
              <CardFooterText>Rendimento semanal</CardFooterText>
              <InvestPercentual>55%</InvestPercentual>
              <Icon name="arrow-up" size={15} colorVariant="green" />
            </CardTextView>
          </Card>
        </Collapse>
      </ScrollViewTab>
    </BackgroundContainer>
  );
};

export default Home;
