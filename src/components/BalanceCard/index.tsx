import { Center, HStack, Skeleton, Text, VStack } from "native-base";
import { useTheme } from "styled-components";
import Carousel from "react-native-snap-carousel";
import { DataContext } from "../../context/Data/dataContext";
import { numberToReal } from "../../utils/number.helper";
import { IThemeProvider } from "../../styles/baseTheme";
import { CardProps } from "./types";
import { metrics } from "../../styles";
import { useContext } from "react";
import { useBalanceCards } from "./hooks/useBalanceCards";
import When from "../When";

const test = [
  { name: "Total das contas", value: 10, color: "#6499E3" },
  { name: "Carteira", value: 10, color: "white" },
];

export const BalanceCards = () => {
  const { theme }: IThemeProvider = useTheme();
  const {
    data: { balance },
  } = useContext(DataContext);
  const { isLoading, data } = useBalanceCards(balance);

  return (
    <>
      <When is={isLoading}>
        <Center>
          <Skeleton
            width="80%"
            height="176px"
            borderRadius="20px"
            startColor={theme?.tertiary}
          />
        </Center>
      </When>
      <When is={!isLoading}>
        <Carousel
          data={data}
          renderItem={({ item }) => <Card {...item} />}
          sliderWidth={metrics.screenWidth}
          itemWidth={(metrics.screenWidth * 80) / 100}
        />
      </When>
    </>
  );
};

const Card = (props: CardProps) => {
  const { theme }: IThemeProvider = useTheme();
  const totalBalance = numberToReal(props.value);
  const [balanceInteger, balanceCents] = totalBalance.split(",");
  return (
    <VStack
      p={5}
      space={5}
      backgroundColor={theme?.tertiary}
      borderRadius="20px"
    >
      <HStack alignItems="center" justifyContent="space-between">
        <Text fontWeight={600}>{props.name}</Text>
        <VStack
          width="15px"
          height="15px"
          backgroundColor={props.color}
          borderRadius={10}
        />
      </HStack>
      <HStack justifyContent="center">
        <Text fontWeight={700} fontSize="4xl">
          {balanceInteger}
          <Text fontWeight={700} opacity={0.3} fontSize="4xl">
            ,{balanceCents}
          </Text>
        </Text>
      </HStack>
      <VStack alignItems="center">
        <Text opacity={0.5}>Saldo atual</Text>
      </VStack>
    </VStack>
  );
};
