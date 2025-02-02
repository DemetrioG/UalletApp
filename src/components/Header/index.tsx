import { useContext } from "react";
import { TouchableOpacity } from "react-native";

import { Menu } from "../Menu";
import { DataContext } from "../../context/Data/dataContext";
import {
  Center,
  HStack,
  Image,
  Pressable,
  Skeleton,
  Text,
  VStack,
  useDisclose,
} from "native-base";
import { Path, Svg } from "react-native-svg";
import { IThemeProvider } from "../../styles/baseTheme";
import { useTheme } from "styled-components";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useGetData, useGetRevenue } from "./hooks/useHeader";
import When from "../When";

import LOGO_SMALL from "../../../assets/images/logoSmall.png";
import { StepableDatePicker } from "../StepableDatePicker";
import { WifiOff } from "lucide-react-native";
import { numberToReal } from "../../utils/number.helper";
import { BalanceCards } from "../BalanceCard";

export const Header = () => {
  const { navigate } = useNavigation<NativeStackNavigationProp<any>>();
  const { theme }: IThemeProvider = useTheme();
  const { data, setData } = useContext(DataContext);
  const { data: revenue, isLoading } = useGetRevenue();
  const {} = useGetData();

  const negativeRevenue = revenue < 0;

  function changeModality() {
    return setData((rest) => ({
      ...rest,
      modality: rest.modality === "Real" ? "Projetado" : "Real",
    }));
  }

  return (
    <VStack position="relative" minHeight="450px">
      <VStack
        position="absolute"
        width="100%"
        zIndex={2}
        backgroundColor={theme?.secondary}
        borderBottomLeftRadius="40px"
        borderBottomRightRadius="40px"
      >
        <StepableDatePicker
          SideButtonProps={{
            style: { padding: 8, backgroundColor: theme?.secondary },
          }}
          ContainerProps={{
            borderBottomLeftRadius: "30px",
            borderBottomRightRadius: "30px",
            backgroundColor: theme?.primary,
            borderColor: theme?.secondary,
          }}
        />
        <VStack space={10} paddingY={5}>
          <BalanceCards />
          <HStack alignItems="center" justifyContent="center" space={6}>
            <TouchableOpacity
              style={{
                paddingHorizontal: 35,
                paddingVertical: 10,
                borderRadius: 40,
                backgroundColor: theme?.blue,
                opacity: data.modality === "Real" ? 1 : 0.3,
                alignSelf: "flex-start",
              }}
              disabled={data.modality === "Real"}
              onPress={changeModality}
            >
              <Text color="white">Realizado</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                paddingHorizontal: 35,
                paddingVertical: 10,
                borderRadius: 40,
                backgroundColor: theme?.blue,
                opacity: data.modality === "Projetado" ? 1 : 0.3,
                alignSelf: "flex-start",
              }}
              disabled={data.modality === "Projetado"}
              onPress={changeModality}
            >
              <Text color="white">Projetado</Text>
            </TouchableOpacity>
          </HStack>
        </VStack>
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
        height="410px"
        paddingX="15px"
        paddingY="15px"
      >
        <When is={isLoading}>
          <Skeleton width="90px" rounded="lg" startColor={theme?.secondary} />
        </When>
        <When is={!isLoading}>
          <>
            <When is={!negativeRevenue}>
              <LineUp />
            </When>
            <When is={negativeRevenue}>
              <LineDown />
            </When>
          </>
        </When>
        <VStack>
          <Text>Receita Mensal</Text>
          <When is={isLoading}>
            <Skeleton h="3" mt="10.5px" startColor={theme?.secondary} />
          </When>
          <When is={!isLoading}>
            <Text color={theme?.blue} fontWeight={600}>
              {!negativeRevenue ? `+${revenue.toFixed(0)}` : revenue.toFixed(0)}
              %
            </Text>
          </When>
        </VStack>
        <Pressable
          backgroundColor={theme?.isOnDarkTheme ? "white" : "black"}
          paddingX="14px"
          paddingY="10px"
          borderRadius={30}
          onPress={() => navigate("Lancamentos")}
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
  );
};

export const HeaderSummary = () => {
  const { theme }: IThemeProvider = useTheme();
  const { data } = useContext(DataContext);
  const {} = useGetData();

  const totalBalance = numberToReal(data.balance.total);
  const [balanceInteger, balanceCents] = totalBalance.split(",");

  return (
    <VStack
      background={theme?.secondary}
      borderBottomLeftRadius="40px"
      borderBottomRightRadius="40px"
    >
      <StepableDatePicker
        SideButtonProps={{
          style: { padding: 8, backgroundColor: theme?.secondary },
        }}
        ContainerProps={{
          borderBottomLeftRadius: "30px",
          borderBottomRightRadius: "30px",
          backgroundColor: theme?.primary,
          borderColor: theme?.secondary,
        }}
      />
      <VStack
        backgroundColor={theme?.secondary}
        paddingX={6}
        borderBottomLeftRadius="40px"
        borderBottomRightRadius="40px"
      >
        <HStack paddingY={4} justifyContent="space-between" alignItems="center">
          <HStack alignItems="center" space={3}>
            <Text>Saldo total:</Text>
            <HStack maxWidth="160px">
              <Text fontWeight={700} fontSize="18px">
                {balanceInteger}
                <Text fontWeight={700} opacity={0.3} fontSize="18px">
                  ,{balanceCents}
                </Text>
              </Text>
            </HStack>
          </HStack>
          <HomeMenu />
        </HStack>
      </VStack>
    </VStack>
  );
};

const HomeMenu = () => {
  const menu = useDisclose();
  const { data } = useContext(DataContext);
  const { theme }: IThemeProvider = useTheme();

  return (
    <VStack>
      <When is={!data.isNetworkConnected}>
        <Pressable onPress={menu.onToggle}>
          <WifiOff color={theme?.red} />
        </Pressable>
      </When>
      <When is={!!data.isNetworkConnected}>
        <Pressable onPress={menu.onToggle}>
          <Image source={LOGO_SMALL} width="25px" h="30px" alt="Logo Uallet" />
        </Pressable>
      </When>
      <Menu {...menu} />
    </VStack>
  );
};

const LineUp = () => {
  const { theme }: IThemeProvider = useTheme();
  return (
    <Svg width="88" height="37" viewBox="0 0 88 37" fill="none">
      <Path
        d="M2 13.0842C2 13.0842 17.3846 46.3131 22.7692 30.9385C28.1538 15.564 38.5385 -14.1933 45.4615 13.0842C52.3846 40.3617 65.4861 16.987 87 3.16513"
        stroke={theme?.blue}
        strokeWidth="3"
      />
    </Svg>
  );
};

const LineDown = () => {
  const { theme }: IThemeProvider = useTheme();
  return (
    <Svg width="88" height="37" viewBox="0 0 88 37" fill="none">
      <Path
        d="M2 23.9158C2 23.9158 17.3846 -9.31307 22.7692 6.06148C28.1538 21.436 38.5385 51.1933 45.4615 23.9158C52.3846 -3.36165 65.4861 20.013 87 33.8349"
        stroke={theme?.blue}
        strokeWidth="3"
      />
    </Svg>
  );
};
