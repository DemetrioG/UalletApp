import { useTheme } from "styled-components";
import { Swipeable } from "react-native-gesture-handler";
import { ListEntries } from "../types";
import { IThemeProvider } from "../../../../styles/baseTheme";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { HStack, Pressable, Text, VStack } from "native-base";
import When from "../../../../components/When";
import { CardDownIcon, CardUpIcon } from "../../../../components/CustomIcons";
import { convertDateFromDatabase } from "../../../../utils/date.helper";
import { numberToReal } from "../../../../utils/number.helper";
import { TrashIcon } from "lucide-react-native";
import { useHandleConfirmDeleteEntrie } from "../hooks/useEntries";
import { ActivityIndicator } from "react-native";

export const Item = ({ row, index }: { row: ListEntries; index: number }) => {
  const { theme }: IThemeProvider = useTheme();
  const { navigate } = useNavigation<NativeStackNavigationProp<any>>();
  const isRevenue = row.type === "Receita";

  return (
    <Swipeable renderRightActions={() => <Delete row={row} />}>
      <Pressable onPress={() => navigate("Lancamentos/Form", row)}>
        <HStack
          backgroundColor={theme?.secondary}
          justifyContent="space-between"
          alignItems="center"
          // borderTopWidth={index === 0 ? 0 : 1}
          borderColor={theme?.primary}
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
              borderRadius={50}
            >
              <When is={row.type === "Receita"}>
                <CardUpIcon />
              </When>
              <When is={row.type === "Despesa"}>
                <CardDownIcon />
              </When>
            </VStack>
            <VStack>
              <Text fontWeight={500} fontSize="14px">
                {row.description}
              </Text>
              <Text fontSize="14px" opacity={0.8}>
                {convertDateFromDatabase(row.date).slice(0, 5)}
              </Text>
            </VStack>
          </HStack>
          <Text fontWeight={600} color={isRevenue ? theme?.blue : theme?.text}>
            {isRevenue ? "+" : "-"}
            {numberToReal(row.value)}
          </Text>
        </HStack>
      </Pressable>
    </Swipeable>
  );
};

const Delete = (props: { row: ListEntries }) => {
  const { theme }: IThemeProvider = useTheme();
  const { isLoading, handleDelete } = useHandleConfirmDeleteEntrie();

  return (
    <Pressable
      backgroundColor={theme?.red}
      opacity={0.8}
      alignItems="center"
      justifyContent="center"
      paddingX={5}
      marginLeft={5}
      borderTopRightRadius="20px"
      borderBottomRightRadius="20px"
      onPress={() => handleDelete(props.row)}
    >
      <When is={isLoading}>
        <ActivityIndicator color="white" />
      </When>
      <When is={!isLoading}>
        <TrashIcon color="white" />
      </When>
    </Pressable>
  );
};
