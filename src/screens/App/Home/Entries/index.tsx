import {
  FlatList,
  HStack,
  Pressable,
  Skeleton,
  Text,
  VStack,
} from "native-base";
import { useTheme } from "styled-components";
import { IThemeProvider } from "../../../../styles/baseTheme";
import When from "../../../../components/When";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { EmptyChart } from "../../../../components/EmptyChart";
import { useGetLastEntries } from "../hooks/useHome";
import { Item } from "../../Entries/Item";

export const Entries = () => {
  const { navigate } = useNavigation<NativeStackNavigationProp<any>>();
  const { isLoading, lastEntries } = useGetLastEntries();
  const { theme }: IThemeProvider = useTheme();
  const isEmpty = !Boolean(lastEntries.length);

  return (
    <VStack backgroundColor={theme?.secondary} borderRadius={30} p={4} pt={5}>
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
              <EmptyChart
                actionText="Realize seu primeiro lançamento"
                route="Lancamentos"
              />
            </When>
            <When is={!isEmpty}>
              <>
                {lastEntries.map((row, index) => (
                  <Item row={row} key={index} index={index} />
                ))}
              </>
            </When>
          </>
        </When>
      </VStack>
    </VStack>
  );
};
