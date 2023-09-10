import { HStack, Text, VStack } from "native-base";
import { useTheme } from "styled-components";
import Carousel from "react-native-reanimated-carousel";
import { BalanceProps } from "../../context/Data/dataContext";
import { numberToReal } from "../../utils/number.helper";
import { IThemeProvider } from "../../styles/baseTheme";
import { CardProps } from "./types";

const test = [
  { name: "Total", value: 10, color: "white" },
  { name: "Carteira", value: 10, color: "white" },
];

export const BalanceCard = ({ data }: { data: BalanceProps }) => {
  return (
    <Carousel
      data={test}
      renderItem={({ item }) => <Card {...item} />}
      width={280}
      height={200}
    />
  );
};

const Card = (props: CardProps) => {
  const { theme }: IThemeProvider = useTheme();
  const totalBalance = numberToReal(props.value);
  const [balanceInteger, balanceCents] = totalBalance.split(",");
  return (
    <VStack
      width="80%"
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
