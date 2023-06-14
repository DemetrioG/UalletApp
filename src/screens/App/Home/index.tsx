import * as React from "react";
import { TouchableOpacity, View } from "react-native";
import { Collapse, HStack, Image, Pressable, Text, VStack } from "native-base";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import firebase from "../../../services/firebase";
import { IEntryList } from "../Entry";
import InvestSummary from "../../../components/InvestSummary";
import Consolidate from "../../../components/Consolidate";
import LineChart from "../../../components/LineChart";
import Icon from "../../../components/Icon";
import { UserContext } from "../../../context/User/userContext";
import { LoaderContext } from "../../../context/Loader/loaderContext";
import { DataContext } from "../../../context/Data/dataContext";
import { numberToReal } from "../../../utils/number.helper";
import {
  CardHeaderView,
  CardTextView,
  Invest,
  LogoCard,
  Section,
  SectionText,
  ValueContainer,
  DescriptionContainer,
  EmptyEntryText,
} from "./styles";
import {
  Balance,
  Card,
  ItemContainer,
  ScrollViewTab,
  Skeleton,
  ValueText,
  BackgroundContainer,
} from "../../../styles/general";
import {
  checkFutureDebitsToConsolidate,
  completeUser,
  getLastEntry,
} from "./querys";
import { getBalance } from "../../../utils/query.helper";
import EntrySegmentChart from "./EntrySegmentChart";
import { useTheme } from "styled-components";
import { IThemeProvider } from "../../../styles/baseTheme";
import { Path, Svg, SvgFromUri, SvgUri } from "react-native-svg";
import { Menu } from "../../../components/Menu";

const LOGO_SMALL = require("../../../../assets/images/logoSmall.png");

function ItemList({
  item,
}: {
  item: IEntryList | firebase.firestore.DocumentData;
}) {
  return (
    <ItemContainer>
      <DescriptionContainer>
        <Text>
          {item.description.length > 18
            ? `${item.description.slice(0, 18)}...`
            : item.description}
        </Text>
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

export const Home = () => {
  const { theme }: IThemeProvider = useTheme();
  const { navigate } = useNavigation<NativeStackNavigationProp<any>>();
  const { user, setUser } = React.useContext(UserContext);
  const {
    loader: {
      name,
      balance,
      entrySegmentChart,
      lineChart,
      homeVisible,
      equity,
    },
    setLoader,
  } = React.useContext(LoaderContext);
  const { data, setData } = React.useContext(DataContext);
  const [consolidate, setConsolidate] = React.useState(false);
  const [financeShow, setFinanceShow] = React.useState(true);
  const [investShow, setInvestShow] = React.useState(true);
  const [lastEntry, setLastEntry] = React.useState<
    Array<IEntryList | firebase.firestore.DocumentData>
  >([]);
  const [balanceInteger, balanceCents] = data.balance.split(",");

  React.useEffect(() => {
    checkFutureDebitsToConsolidate().then((v) => {
      v.forEach((result) => {
        result.data() && setConsolidate(true);
      });
    });

    /**
     * Verifica se tem todas as informações de usuário preenchidas no banco, se não, builda a tela de preenchimento
     */
    if (user.complete) return;
    completeUser().then((v) => {
      setUser((userState) => ({
        ...userState,
        complete: true,
      }));
      if (!v.data()?.birthDate) {
        navigate("Home/Complete");
      }
    });
  }, []);

  React.useEffect(() => {
    if (!data.year) return;

    getBalance({
      month: data.month,
      year: data.year,
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
    if (name && balance && lineChart && entrySegmentChart && homeVisible) {
      setLoader((loaderState) => ({
        ...loaderState,
        homeVisible: false,
      }));
    }
  }, [balance, lineChart, entrySegmentChart, name, equity]);

  return (
    <BackgroundContainer>
      <Consolidate visible={consolidate} setVisible={setConsolidate} />
      <ScrollViewTab showsVerticalScrollIndicator={false}>
        <VStack position="relative">
          <VStack
            position="absolute"
            width="100%"
            zIndex={2}
            backgroundColor={theme?.secondary}
            borderBottomLeftRadius="40px"
            borderBottomRightRadius="40px"
            paddingX="15px"
            paddingBottom="40px"
          >
            <HStack position="relative" paddingY="20px" justifyContent="center">
              <Text>Saldo atual</Text>
              <Menu StackProps={{ position: "absolute", top: 3, right: 0 }} />
            </HStack>
            <HStack justifyContent="center" paddingY="5px">
              <Text fontWeight={700} fontSize="4xl">
                {balanceInteger}
                <Text fontWeight={700} opacity={0.3} fontSize="4xl">
                  ,{balanceCents}
                </Text>
              </Text>
            </HStack>
          </VStack>
          <HStack
            position="absolute"
            alignItems="flex-end"
            justifyContent="space-between"
            width="100%"
            zIndex={1}
            backgroundColor={theme?.tertiary}
            borderBottomLeftRadius="40px"
            borderBottomRightRadius="40px"
            height="235px"
            paddingX="15px"
            paddingY="15px"
          >
            <Svg width="88" height="37" viewBox="0 0 88 37" fill="none">
              <Path
                d="M2 13.0842C2 13.0842 17.3846 46.3131 22.7692 30.9385C28.1538 15.564 38.5385 -14.1933 45.4615 13.0842C52.3846 40.3617 65.4861 16.987 87 3.16513"
                stroke={theme?.blue}
                strokeWidth="3"
              />
            </Svg>
            <VStack>
              <Text>Receita Mensal</Text>
              <Text color={theme?.blue} fontWeight={600}>
                +10%
              </Text>
            </VStack>
            <Pressable
              backgroundColor={theme?.isOnDarkTheme ? "white" : "black"}
              paddingX="14px"
              paddingY="10px"
              borderRadius={30}
            >
              <Text
                color={theme?.isOnDarkTheme ? "black" : "white"}
                fontWeight={600}
              >
                Ver mais
              </Text>
            </Pressable>
          </HStack>
        </VStack>
        {/* <TouchableOpacity onPress={() => setFinanceShow(!financeShow)}>
          <Section>
            <SectionText>Finanças</SectionText>
            <Icon
              name={financeShow ? "chevron-down" : "chevron-right"}
              colorVariant="tertiary"
            />
          </Section>
        </TouchableOpacity> */}
        {/* <Collapse isOpen={financeShow}>
          <Card>
            <Skeleton isLoaded={!homeVisible} width={"full"} h={69}>
              <CardHeaderView balance>
                <CardTextView>
                  <Text fontSize={"md"}>Saldo atual</Text>
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
                      <Text fontSize={"md"}>Últimos lançamentos</Text>
                    </CardTextView>
                    <Icon
                      name="edit-3"
                      onPress={() => navigate("Lancamentos")}
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
          <Card>
            <Skeleton isLoaded={!homeVisible} h={152} width={"full"}>
              <CardHeaderView>
                <CardTextView>
                  <Text fontSize={"md"}>Receitas x Despesas</Text>
                </CardTextView>
              </CardHeaderView>
            </Skeleton>
            <LineChart />
          </Card>
          <Card>
            <Skeleton isLoaded={!homeVisible} h={12} width={"full"}>
              <CardHeaderView>
                <CardTextView>
                  <Text fontSize={"md"}>Despesas por segmento</Text>
                </CardTextView>
              </CardHeaderView>
            </Skeleton>
            <EntrySegmentChart />
          </Card>
        </Collapse> */}
      </ScrollViewTab>
    </BackgroundContainer>
  );
};
