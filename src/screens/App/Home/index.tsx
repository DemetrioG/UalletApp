import * as React from "react";
import { TouchableOpacity, View } from "react-native";
import {
  Collapse,
  HStack,
  Image,
  Pressable,
  Text,
  VStack,
  useDisclose,
} from "native-base";
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
import {
  Edit3,
  LucideIcon,
  MoreHorizontal,
  Plug,
  Rocket,
} from "lucide-react-native";
import { useGetBalance } from "../../../hooks/useBalance";
import {
  useCheckConsolidation,
  useGetLastEntries,
  useIsUserWithCompleteData,
} from "./hooks/useHome";

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
  const { data } = React.useContext(DataContext);

  const consolidation = useDisclose();
  const { handleGetBalance } = useGetBalance();
  const { handleGetLastEntries, lastEntries } = useGetLastEntries();
  const {} = useCheckConsolidation(consolidation);
  const {} = useIsUserWithCompleteData();

  React.useEffect(() => {
    handleGetBalance();
  }, [data.modality, data.month, data.year, consolidation.isOpen]);

  React.useEffect(() => {
    handleGetLastEntries();
  }, [
    data.modality,
    data.month,
    data.year,
    consolidation.isOpen,
    data.balance,
  ]);

  // React.useEffect(() => {
  //   if (name && balance && lineChart && entrySegmentChart && homeVisible) {
  //     setLoader((loaderState) => ({
  //       ...loaderState,
  //       homeVisible: false,
  //     }));
  //   }
  // }, [balance, lineChart, entrySegmentChart, name, equity]);

  return (
    <BackgroundContainer>
      <Consolidate
        visible={consolidation.isOpen}
        onClose={consolidation.onClose}
      />
      <ScrollViewTab showsVerticalScrollIndicator={false}>
        <Header />
        <HStack justifyContent="space-evenly">
          <Action text="Lançamentos" Icon={Edit3} />
          <Action text="Integrações" Icon={Plug} />
          <Action text="Upgrades" Icon={Rocket} />
          <Action text="Mais" Icon={MoreHorizontal} />
        </HStack>
        {/* <Collapse isOpen={financeShow}>
          <Card>
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
