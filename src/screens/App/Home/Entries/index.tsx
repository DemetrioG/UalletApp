import { HStack, Pressable, Skeleton, Text, VStack } from "native-base";
import { useTheme } from "styled-components";
import { IThemeProvider } from "../../../../styles/baseTheme";
import { numberToReal } from "../../../../utils/number.helper";
import { convertDateFromDatabase } from "../../../../utils/date.helper";
import When from "../../../../components/When";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { CardDownIcon, CardUpIcon } from "../../../../components/CustomIcons";
import { EmptyChart } from "../../../../components/EmptyChart";
import { ListEntries } from "../../Entries/types";
import { useGetLastEntries } from "../hooks/useHome";

export const Entries = () => {
  const { navigate } = useNavigation<NativeStackNavigationProp<any>>();
  const { isLoading, lastEntries } = useGetLastEntries();
  const { theme }: IThemeProvider = useTheme();
  const isEmpty = !Boolean(lastEntries.length);

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
        <When is={isLoading}>
          <Skeleton
            h="75px"
            startColor={theme?.tertiary}
            rounded="20px"
            mt="10px"
          />
        </When>
        <When is={!isLoading}>
          <>
            <When is={isEmpty}>
              <EmptyChart actionText="Realize seu primeiro lançamento" />
            </When>
            <When is={!isEmpty}>
              <>
                {lastEntries.map((item, index) => {
                  return <Item item={item} key={index} index={index} />;
                })}
              </>
            </When>
          </>
        </When>
      </VStack>
    </VStack>
  );
};

const Item = ({ item, index }: { item: ListEntries; index: number }) => {
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
