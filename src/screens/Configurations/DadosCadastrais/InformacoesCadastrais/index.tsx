import React from "react";
import { Text } from "react-native";
import {
  BackgroundContainer,
  Skeleton,
  TextHeaderScreen,
  ViewTab,
} from "../../../../styles/general";
import { UserContext } from "../../../../context/User/userContext";
import { getUser } from "./query";
import { HStack, ScrollView, VStack } from "native-base";
import { ItemText } from "../../../../components/Menu/styles";
import { convertDateFromDatabase } from "../../../../utils/date.helper";
import Icon from "../../../../components/Icon";
import { useNavigation } from "@react-navigation/native";

type UserInfo = {
  birthDate: string;
  dateRegister: {
    seconds: number;
    nanoseconds: number;
  };
  email: string;
  income: string;
  name: string;
  profile: string;
};

export const InformacoesCadastraisScreen = () => {
  const [userInfo, setUserInfo] = React.useState<UserInfo | null>(null);
  const { goBack } = useNavigation();
  const { user } = React.useContext(UserContext);
  const loading = !userInfo;
  const dataRegistro =
    userInfo && convertDateFromDatabase(userInfo.dateRegister);

  React.useEffect(() => {
    getUser<UserInfo>(user.uid as string).then(setUserInfo);
  }, []);

  return (
    <BackgroundContainer>
      <ViewTab>
        <Skeleton isLoaded={!loading} height={"full"}>
          <HStack alignItems="center" space={3} mb={10}>
            <Icon name="chevron-left" size={24} onPress={goBack} />
            <TextHeaderScreen noMarginBottom>
              Informações Pessoais
            </TextHeaderScreen>
          </HStack>
          <ScrollView>
            <VStack mb={3}>
              <ItemText fontWeight="bold">Nome</ItemText>
              <ItemText>{userInfo?.name}</ItemText>
            </VStack>
            <VStack mb={3}>
              <ItemText fontWeight="bold">E-mail</ItemText>
              <ItemText>{userInfo?.email}</ItemText>
            </VStack>
            <VStack mb={3}>
              <ItemText fontWeight="bold">Perfil</ItemText>
              <ItemText>{userInfo?.profile}</ItemText>
            </VStack>
            <VStack mb={3}>
              <ItemText fontWeight="bold">Renda</ItemText>
              <ItemText fontFamily={"mono"}>{userInfo?.income}</ItemText>
            </VStack>
            <VStack mb={3}>
              <ItemText fontWeight="bold">Data de nascimento</ItemText>
              <ItemText fontFamily={"mono"}>{userInfo?.birthDate}</ItemText>
            </VStack>
            <VStack mb={3}>
              <ItemText fontWeight="bold">Data de registro</ItemText>
              <ItemText fontFamily={"mono"}>{dataRegistro}</ItemText>
            </VStack>
          </ScrollView>
        </Skeleton>
      </ViewTab>
    </BackgroundContainer>
  );
};
