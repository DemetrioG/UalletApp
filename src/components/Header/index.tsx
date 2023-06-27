import { useContext } from "react";

import { Menu } from "../Menu";
import { DatePicker } from "../DatePicker";
import { DataContext } from "../../context/Data/dataContext";
import { HStack, Pressable, Text, VStack, useDisclose } from "native-base";
import { Path, Svg } from "react-native-svg";
import { IThemeProvider } from "../../styles/baseTheme";
import { useTheme } from "styled-components";
import { CalendarRange } from "lucide-react-native";
import { TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useGetData } from "./hooks/useData";

export const Header = () => {
  const { navigate } = useNavigation<NativeStackNavigationProp<any>>();
  const { theme }: IThemeProvider = useTheme();
  const { data } = useContext(DataContext);
  const {} = useGetData();

  const {
    isOpen: isOpenMonth,
    onClose: onCloseMonth,
    onOpen: onOpenMonth,
  } = useDisclose();
  const {
    isOpen: isOpenYear,
    onClose: onCloseYear,
    onOpen: onOpenYear,
  } = useDisclose();

  const [balanceInteger, balanceCents] = data.balance.split(",");

  return (
    <>
      <DatePicker
        options={optionsMonth}
        type="Mês"
        visibility={isOpenMonth}
        handleClose={onCloseMonth}
        next={onOpenYear}
      />
      <DatePicker
        options={optionsYear}
        type="Ano"
        visibility={isOpenYear}
        handleClose={onCloseYear}
      />
      <VStack position="relative" minHeight="260px">
        <VStack
          position="absolute"
          width="100%"
          zIndex={2}
          backgroundColor={theme?.secondary}
          borderBottomLeftRadius="40px"
          borderBottomRightRadius="40px"
          paddingX={4}
          paddingBottom="40px"
        >
          <HStack
            position="relative"
            paddingY="20px"
            justifyContent="space-between"
            alignItems="center"
          >
            <TouchableOpacity onPress={onOpenMonth}>
              <CalendarRange color={theme?.text} />
            </TouchableOpacity>
            <Text>Saldo atual</Text>
            <Menu />
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
          height="240px"
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
    </>
  );
};

export const HeaderSummary = () => {
  const { theme }: IThemeProvider = useTheme();
  const { data } = useContext(DataContext);
  const {} = useGetData();

  const [balanceInteger, balanceCents] = data.balance.split(",");

  return (
    <VStack
      backgroundColor={theme?.secondary}
      borderBottomLeftRadius="40px"
      borderBottomRightRadius="40px"
      paddingX={6}
    >
      <HStack paddingY={4} justifyContent="space-between" alignItems="center">
        <HStack alignItems="center" space={3}>
          <Text>Saldo:</Text>
          <HStack>
            <Text fontWeight={700} fontSize="18px">
              {balanceInteger}
              <Text fontWeight={700} opacity={0.3} fontSize="18px">
                ,{balanceCents}
              </Text>
            </Text>
          </HStack>
        </HStack>
        <Menu />
      </HStack>
    </VStack>
  );
};

const optionsMonth = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];
const optionsYear: number[] = [];

for (let index = 0; index < 5; index++) {
  optionsYear.push(new Date().getFullYear() + index);
}
