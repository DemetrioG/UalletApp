import React from "react";
import { Text } from "react-native";
import { BackgroundContainer, TextHeader, ViewTab } from "../../../../styles/general";
import { UserContext } from "../../../../context/User/userContext";
import { getUser } from "./query";
import { HStack, VStack } from "native-base";
import { ItemText } from "../../../../components/Menu/styles";
import { convertDateFromDatabase } from "../../../../utils/date.helper";
import Icon from "../../../../components/Icon";
import { fonts } from "../../../../styles";
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
                {(loading && (
                    //#TODO: Spinner de loading
                    <Text>{"Carregando..."}</Text>
                )) || (
                    <>
                        <HStack alignItems="center" space={3} mb={10}>
                            <Icon
                                name="chevron-left"
                                size={24}
                                onPress={goBack}
                            />
                            <TextHeader fontSize={fonts.large}>
                                Informações Pessoais
                            </TextHeader>
                        </HStack>
                        <VStack space={3}>
                            <ItemText fontWeight="bold">Nome</ItemText>
                            <ItemText>{userInfo?.name}</ItemText>
                            <ItemText fontWeight="bold">E-mail</ItemText>
                            <ItemText>{userInfo?.email}</ItemText>
                            <ItemText fontWeight="bold">Perfil</ItemText>
                            <ItemText>{userInfo?.profile}</ItemText>
                            <ItemText fontWeight="bold">Renda</ItemText>
                            <ItemText>{userInfo?.income}</ItemText>
                            <ItemText fontWeight="bold">
                                Data de nascimento
                            </ItemText>
                            <ItemText>{userInfo?.birthDate}</ItemText>
                            <ItemText fontWeight="bold">
                                Data de registro
                            </ItemText>
                            <ItemText>{dataRegistro}</ItemText>
                        </VStack>
                    </>
                )}
            </ViewTab>
        </BackgroundContainer>
    );
};
