import { useEffect, useContext } from "react";
import {
  HStack,
  IPressableProps,
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
  Edit3,
  LucideIcon,
  MoreHorizontal,
  Plug,
  Rocket,
} from "lucide-react-native";

import Consolidate from "../../../components/Consolidate";
import { Header } from "../../../components/Header";
import { Entries } from "./Entries";
import { Planning } from "./Planning";
import { EntriesSegmentChart } from "./EntriesSegmentChart";
import { DataContext } from "../../../context/Data/dataContext";
import { useGetBalance } from "../../../hooks/useBalance";
import {
  useCheckConsolidation,
  useGetLastEntries,
  useIsUserWithCompleteData,
} from "./hooks/useHome";
import { IThemeProvider } from "../../../styles/baseTheme";
import { BackgroundContainer } from "../../../styles/general";
import { Menu } from "../../../components/Menu";
import { Toast } from "react-native-toast-message/lib/src/Toast";

export const Home = () => {
  const { navigate } = useNavigation<NativeStackNavigationProp<any>>();
  const { data } = useContext(DataContext);

  const menu = useDisclose();
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

  return (
    <BackgroundContainer>
      <Consolidate {...consolidation} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <Header />
        <Stack space={5}>
          <HStack justifyContent="space-evenly">
            <Action
              text="Lançamentos"
              Icon={Edit3}
              onPress={() => navigate("Lancamentos")}
            />
            <Action text="Integrações" Icon={Plug} />
            <Action text="Upgrades" Icon={Rocket} />
            <Action text="Mais" Icon={MoreHorizontal} onPress={menu.onOpen} />
          </HStack>
          <Entries lastEntries={lastEntries.slice(0, 3)} />
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
  PressableProps,
}: {
  text: string;
  onPress?: () => any;
  Icon: LucideIcon;
  PressableProps?: IPressableProps;
}) => {
  const { theme }: IThemeProvider = useTheme();

  return (
    <Pressable onPress={onPress} {...PressableProps}>
      <VStack alignItems="center" space={1}>
        <VStack background={theme?.secondary} borderRadius={50} p="20px">
          <Icon color={theme?.text} />
        </VStack>
        <Text fontSize="12px">{text}</Text>
      </VStack>
    </Pressable>
  );
};
