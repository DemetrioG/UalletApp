import { HStack, Pressable, Text, VStack } from "native-base";
import { useTheme } from "styled-components";
import { IThemeProvider } from "../../../../styles/baseTheme";
import { IEntries } from "../../../../types/types";
import { Path, Svg } from "react-native-svg";
import { numberToReal } from "../../../../utils/number.helper";
import { convertDateFromDatabase } from "../../../../utils/date.helper";
import When from "../../../../components/When";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

export const Entries = ({ lastEntries }: { lastEntries: IEntries[] }) => {
  const { navigate } = useNavigation<NativeStackNavigationProp<any>>();
  const { theme }: IThemeProvider = useTheme();
  return (
    <VStack backgroundColor={theme?.secondary} borderRadius="30px" p={4} pt={5}>
      <HStack justifyContent="space-between" alignItems="center" mb={2}>
        <Text fontWeight={600}>Lançamentos</Text>
        <Pressable onPress={() => navigate("Lancamentos")}>
          <Text fontSize="14px" color={theme?.blue}>
            Ver todos
          </Text>
        </Pressable>
      </HStack>
      <VStack>
        {lastEntries.map((item, index) => {
          return <Item item={item} key={index} index={index} />;
        })}
      </VStack>
    </VStack>
  );
};

const Item = ({ item, index }: { item: IEntries; index: number }) => {
  const { theme }: IThemeProvider = useTheme();
  return (
    <HStack
      justifyContent="space-between"
      alignItems="center"
      borderTopWidth={index === 0 ? 0 : 1}
      paddingY={3}
    >
      <HStack space={2} alignItems="center">
        <VStack
          backgroundColor={theme?.primary}
          alignItems="center"
          justifyContent="center"
          p={2}
          w="55px"
          h="55px"
          borderRadius="50%"
        >
          <When is={item.type === "Receita"}>
            <CardUpIcon />
          </When>
          <When is={item.type === "Despesa"}>
            <CardDownIcon />
          </When>
        </VStack>
        <VStack>
          <Text fontWeight={500} fontSize="14px">
            {item.description}
          </Text>
          <Text fontSize="14px" opacity={0.8}>
            {convertDateFromDatabase(item.date).slice(0, 5)}
          </Text>
        </VStack>
      </HStack>
      <Text fontWeight={600}>
        {item.type === "Receita" ? "+" : "-"}
        {numberToReal(item.value)}
      </Text>
    </HStack>
  );
};

const CardDownIcon = () => {
  const { theme }: IThemeProvider = useTheme();
  return (
    <Svg width="32" height="24" viewBox="0 0 32 24" fill="none">
      <Path
        d="M20 5H4C2.89543 5 2 5.89543 2 7V17C2 18.1046 2.89543 19 4 19H20C21.1046 19 22 18.1046 22 17V7C22 5.89543 21.1046 5 20 5Z"
        stroke={theme?.text}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M2 10H22"
        stroke={theme?.text}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M26 12.5V19.5"
        stroke={theme?.text}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M29.5 16L26 19.5L22.5 16"
        stroke={theme?.text}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

const CardUpIcon = () => {
  const { theme }: IThemeProvider = useTheme();
  return (
    <Svg width="32" height="24" viewBox="0 0 32 24" fill="none">
      <Path
        d="M20.0007 5H4.00073C2.89616 5 2.00073 5.89543 2.00073 7V17C2.00073 18.1046 2.89616 19 4.00073 19H20.0007C21.1053 19 22.0007 18.1046 22.0007 17V7C22.0007 5.89543 21.1053 5 20.0007 5Z"
        stroke={theme?.text}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M2.00073 10H22.0007"
        stroke={theme?.text}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M26.0007 19.5V12.5"
        stroke={theme?.text}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M29.5007 16L26.0007 12.5L22.5007 16"
        stroke={theme?.text}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};
