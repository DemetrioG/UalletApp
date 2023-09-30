import { useTheme } from "styled-components";
import { IThemeProvider } from "../../../../styles/baseTheme";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ListTransfers } from "../types";
import { HStack, Pressable, Text, VStack } from "native-base";
import { numberToReal } from "../../../../utils/number.helper";
import { MoveLeft, MoveRight } from "lucide-react-native";
import { convertDateFromDatabase } from "../../../../utils/date.helper";

export const Item = ({ row, index }: { row: ListTransfers; index: number }) => {
  const { theme }: IThemeProvider = useTheme();
  const { navigate } = useNavigation<NativeStackNavigationProp<any>>();

  return (
    <Pressable onPress={() => navigate("Transfers/Form", row)}>
      <HStack
        backgroundColor={theme?.secondary}
        justifyContent="space-between"
        alignItems="center"
        borderTopWidth={index === 0 ? 0 : 1}
        borderColor={theme?.primary}
        paddingY={3}
      >
        <VStack space={1}>
          <HStack space={2} alignItems="center">
            <MoveLeft color={theme?.red} />
            <Text>{row.originAccountName}</Text>
          </HStack>
          <HStack space={2} alignItems="center">
            <MoveRight color={theme?.blue} />
            <Text>{row.destinationAccountName}</Text>
          </HStack>
        </VStack>
        <VStack space={1} alignItems="flex-end">
          <Text fontWeight={600} color={theme?.text}>
            {numberToReal(row.value)}
          </Text>
          <Text opacity={0.5}>
            {convertDateFromDatabase(row.date).slice(0, 5)}
          </Text>
        </VStack>
      </HStack>
    </Pressable>
  );
};
