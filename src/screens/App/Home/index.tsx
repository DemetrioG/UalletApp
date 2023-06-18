import { useEffect, useContext } from "react";
import { TouchableOpacity, View } from "react-native";
import {
  Collapse,
  HStack,
  Image,
  Pressable,
  Stack,
  Text,
  VStack,
  useDisclose,
} from "native-base";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import firebase from "../../../services/firebase";
import { IEntryList } from "../Entry";
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
import { getBalance } from "../../../utils/query.helper";
import { EntriesSegmentChart } from "./EntriesSegmentChart";
import { useTheme } from "styled-components";
import { IThemeProvider } from "../../../styles/baseTheme";
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
import { Entries } from "./Entries";
import { Planning } from "./Planning";

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
  const { data } = useContext(DataContext);

  const consolidation = useDisclose();
  const { handleGetBalance } = useGetBalance();
  const { handleGetLastEntries, lastEntries } = useGetLastEntries();
  const {} = useCheckConsolidation(consolidation);
  const {} = useIsUserWithCompleteData();

  useEffect(() => {
    handleGetBalance();
  }, [data.modality, data.month, data.year, consolidation.isOpen]);

  useEffect(() => {
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
      <Consolidate {...consolidation} />
      <ScrollViewTab showsVerticalScrollIndicator={false}>
        <Header />
        <Stack space={5}>
          <HStack justifyContent="space-evenly">
            <Action text="Lançamentos" Icon={Edit3} />
            <Action text="Integrações" Icon={Plug} />
            <Action text="Upgrades" Icon={Rocket} />
            <Action text="Mais" Icon={MoreHorizontal} />
          </HStack>
          <Entries lastEntries={lastEntries.slice(0, 3)} />
          <Planning />
          <EntriesSegmentChart />
        </Stack>
        {/* <Collapse isOpen={financeShow}>
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
      <VStack background={theme?.secondary} borderRadius={50} p="20px">
        <Icon color={theme?.text} />
      </VStack>
      <Text fontSize="12px">{text}</Text>
    </VStack>
  );
};
