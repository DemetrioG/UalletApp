import {
  Button,
  Center,
  FlatList,
  HStack,
  Pressable,
  Text,
  VStack,
} from "native-base";
import { BackgroundContainer } from "../../../../../styles/general";
import { IThemeProvider } from "../../../../../styles/baseTheme";
import { useTheme } from "styled-components";
import { ChevronLeft, HeartIcon } from "lucide-react-native";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { ChevronRight } from "lucide-react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useEffect } from "react";
import When from "../../../../../components/When";
import { useListLinkedAccount } from "./hooks/useLinkedAccount";
import { ListLinkedAccount } from "./types";

export const LinkedAccount = () => {
  const { theme }: IThemeProvider = useTheme();
  const { goBack, navigate } = useNavigation<NativeStackNavigationProp<any>>();
  const { data, isLoading, handleExecute } = useListLinkedAccount();
  const isFocused = useIsFocused();

  useEffect(() => {
    isFocused && handleExecute();
  }, [isFocused]);

  return (
    <BackgroundContainer>
      <VStack
        backgroundColor={theme?.secondary}
        flex={1}
        p={5}
        borderTopLeftRadius="30px"
        borderTopRightRadius="30px"
      >
        <VStack flex={1}>
          <HStack alignItems="center" justifyContent="space-between" mb={10}>
            <HStack alignItems="center" space={3}>
              <Pressable onPress={goBack}>
                <ChevronLeft color={theme?.text} />
              </Pressable>
              <Text fontWeight={700}>Cadastro de Conta Conjunta</Text>
            </HStack>
            <HeartIcon color={theme?.red} />
          </HStack>
          <When is={!!data.length}>
            <FlatList
              data={data}
              renderItem={({ item }) => <Item item={item} />}
              keyExtractor={(item) => item.email}
            />
          </When>
          <When is={!data.length}>
            <Center flex={1}>
              <Text>Você ainda não compartilhou seus dados</Text>
            </Center>
          </When>
        </VStack>
        <Button
          onPress={() => navigate("Configuracoes/Records/LinkedAccount/Form")}
        >
          <Text fontWeight="bold" color="white">
            Compartilhar seus dados
          </Text>
        </Button>
      </VStack>
    </BackgroundContainer>
  );
};

const Item = ({ item }: { item: ListLinkedAccount }) => {
  const { theme }: IThemeProvider = useTheme();
  const { navigate } = useNavigation<NativeStackNavigationProp<any>>();
  return (
    <Pressable
      onPress={() => navigate("Configuracoes/Records/LinkedAccount/Form", item)}
      key={item.email}
    >
      <VStack borderBottomWidth={1} borderColor={theme?.primary} p={4}>
        <HStack justifyContent="space-between" alignItems="center">
          <HStack alignItems="center" space={3}>
            <Text>{item.name}</Text>
          </HStack>
          <ChevronRight color={theme?.text} />
        </HStack>
      </VStack>
    </Pressable>
  );
};
