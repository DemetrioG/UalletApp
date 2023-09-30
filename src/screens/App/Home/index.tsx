import {
  HStack,
  Pressable,
  Stack,
  Text,
  VStack,
  useDisclose,
  ScrollView,
} from "native-base";
import { useTheme } from "styled-components";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import {
  ArrowRightLeft,
  Edit3,
  Heart,
  Landmark,
  LucideIcon,
  MoreHorizontal,
  Plug,
  Rocket,
} from "lucide-react-native";

import Consolidate from "./Consolidate";
import { Header } from "../../../components/Header";
import { Entries } from "./Entries";
import { Planning } from "./Planning";
import { EntriesSegmentChart } from "./EntriesSegmentChart";
import { useGetBalance } from "../../../hooks/useBalance";
import {
  useCheckConsolidation,
  useIsUserWithCompleteData,
  useScrollToRefresh,
} from "./hooks/useHome";
import { IThemeProvider } from "../../../styles/baseTheme";
import { BackgroundContainer } from "../../../styles/general";
import { Menu } from "../../../components/Menu";
import { Internet } from "./Internet";
import { InterfaceVStackProps } from "native-base/lib/typescript/components/primitives/Stack/VStack";
import { RefreshControl } from "react-native";
import { Linked } from "./Linked";

export const Home = () => {
  const { navigate } = useNavigation<NativeStackNavigationProp<any>>();

  const menu = useDisclose();
  const consolidation = useDisclose();
  const {} = useGetBalance();
  const {} = useCheckConsolidation(consolidation);
  const {} = useIsUserWithCompleteData();
  const { isLoading, handleExecute } = useScrollToRefresh();

  return (
    <BackgroundContainer>
      <Consolidate {...consolidation} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={handleExecute} />
        }
      >
        <Header />
        <Stack space={5}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <HStack space={4}>
              <Action
                text="Lançamentos"
                Icon={Edit3}
                onPress={() => navigate("Lancamentos")}
              />
              <Action
                text="Transferências"
                Icon={ArrowRightLeft}
                onPress={() => navigate("Transfers")}
              />
              <Action
                text="Contas"
                Icon={Landmark}
                onPress={() => navigate("Configuracoes/Records/Account")}
              />
              <Action
                text="Conta conjunta"
                Icon={Heart}
                onPress={() => navigate("Configuracoes/LinkedAccount")}
              />
              <Action text="Menu" Icon={MoreHorizontal} onPress={menu.onOpen} />
            </HStack>
          </ScrollView>
          <Linked />
          <Internet />
          <Entries />
          <Planning />
          <EntriesSegmentChart />
        </Stack>
      </ScrollView>
      <Menu {...menu} />
    </BackgroundContainer>
  );
};

export const Action = ({
  text,
  onPress,
  Icon,
  StackProps,
}: {
  text: string;
  onPress?: () => any;
  Icon: LucideIcon;
  StackProps?: InterfaceVStackProps;
}) => {
  const { theme }: IThemeProvider = useTheme();

  return (
    <Pressable onPress={onPress}>
      <VStack alignItems="center" space={1} {...StackProps}>
        <VStack background={theme?.secondary} borderRadius={50} p="20px">
          <Icon color={theme?.text} />
        </VStack>
        <Text fontSize="12px">{text}</Text>
      </VStack>
    </Pressable>
  );
};
