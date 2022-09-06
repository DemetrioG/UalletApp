import * as React from "react";
import { View, TouchableOpacity } from "react-native";
import { Collapse, VStack } from "native-base";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import firebase from "../../services/firebase";
import { IEntryList } from "../Entry";
import { TotalOpen as InvestResume } from "../Investments/Positions";
import Consolidate from "../../components/Consolidate";
import SegmentChart from "../../components/SegmentChart";
import LineChart from "../../components/LineChart";
import Icon from "../../components/Icon";
import { UserContext } from "../../context/User/userContext";
import { LoaderContext } from "../../context/Loader/loaderContext";
import { DataContext } from "../../context/Data/dataContext";
import { numberToReal } from "../../utils/number.helper";
import {
  CardHeaderText,
  CardHeaderView,
  CardTextView,
  Invest,
  LogoCard,
  Section,
  SectionText,
  ValueContainer,
  DescriptionContainer,
  DescriptionText,
  EmptyEntryText,
  BackgroundContainer,
} from "./styles";
import {
  Balance,
  Card,
  ItemContainer,
  ScrollViewTab,
  Skeleton,
  ValueText,
} from "../../styles/general";
import {
  checkFutureDebitsToConsolidate,
  completeUser,
  getLastEntry,
} from "./querys";
import { getBalance } from "../../utils/query.helper";
import { refreshAssetData } from "../Investments/Positions/query";
import { getStorage } from "../../utils/storage.helper";

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
          {item.description.length > 18
            ? `${item.description.slice(0, 18)}...`
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
  const { navigate } = useNavigation<NativeStackNavigationProp<any>>();
  const { user, setUser } = React.useContext(UserContext);
  const {
    loader: { name, balance, segmentChart, lineChart, homeVisible, equity },
    setLoader,
  } = React.useContext(LoaderContext);
  const { data, setData } = React.useContext(DataContext);
  const [consolidate, setConsolidate] = React.useState(false);
  const [financeShow, setFinanceShow] = React.useState(true);
  const [investShow, setInvestShow] = React.useState(true);
  const [lastEntry, setLastEntry] = React.useState<
    Array<IEntryList | firebase.firestore.DocumentData>
  >([]);

  React.useEffect(() => {
    // Verifica se há despesas projetadas para consolidar na data atual
    checkFutureDebitsToConsolidate().then((v) => {
      v.forEach((result) => {
        result.data() && setConsolidate(true);
      });
    });

    if (user.complete) return;

    completeUser().then((v) => {
      setUser((userState) => ({
        ...userState,
        complete: true,
      }));
      /**
       * Verifica se tem todas as informações de usuário preenchidas no banco, se não, builda a tela de preenchimento
       */
      if (!v.data()?.birthDate) {
        navigate("Complete");
      }
    });
  }, []);

  React.useEffect(() => {
    if (!data.year) return;

    getBalance({
      month: data.month.toString(),
      modality: data.modality,
    })
      .then((balance) => {
        setData((dataState) => ({
          ...dataState,
          balance,
        }));
      })
      .finally(() => {
        !balance &&
          setLoader((loaderState) => ({
            ...loaderState,
            balance: true,
          }));
      });
  }, [data.modality, data.month, data.year, consolidate]);

  React.useEffect(() => {
    if (!data.year) return;

    getLastEntry({
      modality: data.modality,
      month: data.month,
      year: data.year,
    })
      .then((_lastEntry) => {
        setLastEntry(_lastEntry);
      })
      .finally(() => {
        !lastEntry &&
          setLoader((loaderState) => ({
            ...loaderState,
            lastEntry: true,
          }));
      });
  }, [data.modality, data.month, data.year, consolidate, data.balance]);

  React.useEffect(() => {
    if (name && balance && lineChart && segmentChart && homeVisible) {
      setLoader((loaderState) => ({
        ...loaderState,
        homeVisible: false,
      }));
    }
  }, [balance, lineChart, segmentChart, name, equity]);

  React.useEffect(() => {
    refreshAssetData()
      .then(async () => {
        const totalEquity = await getStorage("investTotalEquity");
        totalEquity &&
          setData((state) => ({
            ...state,
            equity: totalEquity,
          }));
      })
      .finally(() => {
        !equity &&
          setLoader((loaderState) => ({
            ...loaderState,
            equity: true,
          }));
      });
  }, []);

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
            <Skeleton isLoaded={!homeVisible} width={"full"} h={69}>
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
            <Skeleton isLoaded={!homeVisible} h={156} width={"full"}>
              {lastEntry.length > 0 ? (
                <>
                  <CardHeaderView>
                    <CardTextView>
                      <CardHeaderText>Últimos lançamentos</CardHeaderText>
                    </CardTextView>
                    <Icon
                      name="edit-3"
                      onPress={() => navigate("Lançamentos")}
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
            <Skeleton isLoaded={!homeVisible} h={152} width={"full"}>
              <CardHeaderView>
                <CardTextView>
                  <CardHeaderText>Receitas x Despesas</CardHeaderText>
                </CardTextView>
              </CardHeaderView>
            </Skeleton>
            <LineChart />
          </Card>
          <Card>
            <Skeleton isLoaded={!homeVisible} h={168} width={"full"}>
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
            <Skeleton isLoaded={equity} width={"full"} h={69}>
              <CardHeaderView>
                <CardTextView>
                  <CardHeaderText>Patrimônio investido</CardHeaderText>
                </CardTextView>
                <Icon
                  name="maximize-2"
                  onPress={() => navigate("Investimentos")}
                />
              </CardHeaderView>
              <Invest>
                {!user.hideNumbers
                  ? numberToReal(data.equity)
                  : "** ** ** ** **"}
              </Invest>
              <VStack>
                <InvestResume
                  label="HOJE"
                  percentual="0,00"
                  value="R$ 0,00"
                  inlineLabel
                />
                <InvestResume
                  label="TOTAL"
                  percentual="0,00"
                  value="R$ 0,00"
                  inlineLabel
                />
              </VStack>
            </Skeleton>
          </Card>
        </Collapse>
      </ScrollViewTab>
    </BackgroundContainer>
  );
};

export default Home;
