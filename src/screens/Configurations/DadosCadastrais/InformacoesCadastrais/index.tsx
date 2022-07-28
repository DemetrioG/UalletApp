import React from "react";
import { Text } from "react-native";
import { BackgroundContainer, ViewTab } from "../../../../styles/general";
import { UserContext } from "../../../../context/User/userContext";
import { getUser } from "./query";
import { VStack } from "native-base";
import { ItemText } from "../../../../components/Menu/styles";
import { convertDateFromDatabase } from "../../../../utils/date.helper";

type UserInfo = {
  birthDate: string;
  dateRegister: {
    seconds: number,
    nanoseconds: number,
  },
  email: string,
  income: string,
  name: string,
  profile: string,
}

export const InformacoesCadastraisScreen = () => {
    const [userInfo, setUserInfo] = React.useState<UserInfo | null>(null);
    const { user } = React.useContext(UserContext);
    const loading = !userInfo;
    const dataRegistro = userInfo && convertDateFromDatabase(userInfo.dateRegister);

    React.useEffect(() => {
      getUser<UserInfo>(user.uid as string).then(setUserInfo);
    }, []);

    return (
        <BackgroundContainer>
            <ViewTab>
              {loading && (
                //#TODO: Spinner de loading
                <Text>{"Carregando..."}</Text>
              ) || (
                <VStack space={3}>
                  <ItemText fontWeight="bold">Nome</ItemText>
                  <ItemText>{userInfo?.name}</ItemText>
                  <ItemText fontWeight="bold">E-mail</ItemText>
                  <ItemText>{userInfo?.email}</ItemText>
                  <ItemText fontWeight="bold">Perfil</ItemText>
                  <ItemText>{userInfo?.profile}</ItemText>
                  <ItemText fontWeight="bold">Renda</ItemText>
                  <ItemText>{userInfo?.income}</ItemText>
                  <ItemText fontWeight="bold">Data de nascimento</ItemText>
                  <ItemText>{userInfo?.birthDate}</ItemText>
                  <ItemText fontWeight="bold">Data de registro</ItemText>
                  <ItemText>{dataRegistro}</ItemText>
                </VStack>
              )}
            </ViewTab>
        </BackgroundContainer>
    );
};
