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
import { Header } from "../../../components/Header";
import { Edit3, LucideIcon, MoreHorizontal, Plug, Rocket } from "lucide-react-native";

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
        <Header />
        <HStack justifyContent='space-evenly'>
          <Action text="Lançamentos" Icon={Edit3} />
          <Action text="Integrações" Icon={Plug} />
          <Action text="Upgrades" Icon={Rocket} />
          <Action text="Mais" Icon={MoreHorizontal} />
        </HStack>
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

export const Action = ({ text, Icon }: { text: string; Icon: LucideIcon }) => {
  const { theme }: IThemeProvider = useTheme();

  return (
    <VStack alignItems="center" space={1}>
      <VStack
        style={{
          backgroundColor: theme?.secondary,
          borderRadius: 50,
          padding: 20,
        }}
      >
        <Icon color={theme?.text} />
      </VStack>
      <Text fontSize="12px">{text}</Text>
    </VStack>
  );
};
