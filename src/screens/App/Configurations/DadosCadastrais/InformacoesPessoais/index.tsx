import React from "react";
import { BackgroundContainer } from "../../../../../styles/general";
import { HStack, Pressable, ScrollView, Text, VStack } from "native-base";
import { convertDateFromDatabase } from "../../../../../utils/date.helper";
import { useNavigation } from "@react-navigation/native";
import { IThemeProvider } from "../../../../../styles/baseTheme";
import { useTheme } from "styled-components";
import { ChevronLeft } from "lucide-react-native";
import { useGetUser } from "./hooks/useUser";

const InformacoesPessoaisScreen = () => {
  const { theme }: IThemeProvider = useTheme();
  const { goBack } = useNavigation();
  const { data } = useGetUser();
  const dataRegistro = data && convertDateFromDatabase(data.dateRegister);

  return (
    <BackgroundContainer>
      <VStack
        backgroundColor={theme?.secondary}
        flex={1}
        p={5}
        borderTopLeftRadius="30px"
        borderTopRightRadius="30px"
      >
        <HStack alignItems="center" space={3} mb={10}>
          <Pressable onPress={goBack}>
            <ChevronLeft color={theme?.text} />
          </Pressable>
          <Text fontWeight={700}>Informações Pessoais</Text>
        </HStack>
        <ScrollView>
          <VStack mb={3}>
            <Text fontWeight="bold">Nome</Text>
            <Text>{data?.name || "Não informado"}</Text>
          </VStack>
          <VStack mb={3}>
            <Text fontWeight="bold">E-mail</Text>
            <Text>{data?.email || "Não informado"}</Text>
          </VStack>
          <VStack mb={3}>
            <Text fontWeight="bold">Perfil</Text>
            <Text>{data?.profile || "Não informado"}</Text>
          </VStack>
          <VStack mb={3}>
            <Text fontWeight="bold">Renda</Text>
            <Text>{data?.income || "Não informado"}</Text>
          </VStack>
          <VStack mb={3}>
            <Text fontWeight="bold">Data de nascimento</Text>
            <Text>{data?.birthDate || "Não informado"}</Text>
          </VStack>
          <VStack mb={3}>
            <Text fontWeight="bold">Data de registro</Text>
            <Text>{dataRegistro || "Não informado"}</Text>
          </VStack>
        </ScrollView>
      </VStack>
    </BackgroundContainer>
  );
};

export default InformacoesPessoaisScreen;
