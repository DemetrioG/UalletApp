import * as React from "react";
import { Image, VStack, Pressable } from "native-base";
import { IVStackProps } from "native-base/lib/typescript/components/primitives/Stack/VStack";
import Modal from "react-native-modal";

import Icon from "../Icon";
import { ConfirmContext } from "../../context/ConfirmDialog/confirmContext";
import { DataContext } from "../../context/Data/dataContext";
import { initialUserState, UserContext } from "../../context/User/userContext";
import {
  initialLoaderState,
  LoaderContext,
} from "../../context/Loader/loaderContext";
import { removeAllStorage } from "@utils/storage.helper";
import {
  AvatarMenu,
  AvatarMenuText,
  Container,
  Email,
  ItemContainer,
  ItemContent,
  ItemText,
  MenuContainer,
  Name,
  ProfileContainer,
} from "./styles";
import { useNavigation } from "@react-navigation/native";
import { refreshAuthDevice } from "./query";

export const Menu = ({ StackProps }: { StackProps: IVStackProps }) => {
  const { navigate } = useNavigation();
  const { data, setData } = React.useContext(DataContext);
  const { setLoader } = React.useContext(LoaderContext);
  const { setConfirm } = React.useContext(ConfirmContext);
  const { user, setUser } = React.useContext(UserContext);

  const [visible, setVisible] = React.useState(false);

  function changeModality() {
    return setData((dataState) => ({
      ...dataState,
      modality: dataState.modality === "Real" ? "Projetado" : "Real",
    }));
  }

  function logout() {
    refreshAuthDevice(data.expoPushToken!);
    removeAllStorage()
      .then(() => {})
      .catch(() => {})
      .finally(() => {
        setUser(initialUserState);
        setLoader(initialLoaderState);
      });
  }

  function handleLogout() {
    setVisible(false);
    setTimeout(() => {
      setConfirm({
        title: "Deseja realmente sair do app?",
        visibility: true,
        callbackFunction: logout,
      });
    }, 500);
  }

  function goToConfiguracoesScreen() {
    setVisible(false);
    //#TODO: adicionar tipagem de navegação
    return setTimeout(() => navigate("Configuracoes" as any), 150);
  }

  return (
    <VStack {...StackProps}>
      <Pressable onPress={() => setVisible(!visible)}>
        <Image source={LOGO_SMALL} width="25px" h="30px" />
      </Pressable>
      <Modal
        isVisible={visible}
        swipeDirection={"down"}
        onSwipeComplete={() => setVisible(false)}
        onBackdropPress={() => setVisible(false)}
      >
        <Container>
          <ProfileContainer>
            <AvatarMenu>
              <AvatarMenuText>{user.name[0]}</AvatarMenuText>
            </AvatarMenu>
            <Name>{user.completeName}</Name>
            <Email>{user.email}</Email>
          </ProfileContainer>
          <MenuContainer>
            <ItemContainer>
              <ItemContent onPress={changeModality}>
                <ItemText>{data.modality}</ItemText>
                <Icon name="repeat" size={16} />
              </ItemContent>
            </ItemContainer>
            <ItemContainer>
              <ItemContent onPress={goToConfiguracoesScreen}>
                <ItemText>Configurações</ItemText>
                <Icon name="settings" size={18} />
              </ItemContent>
            </ItemContainer>
            <ItemContainer>
              <ItemContent onPress={handleLogout}>
                <ItemText logout>Logout</ItemText>
                <Icon name="power" size={18} colorVariant="red" />
              </ItemContent>
            </ItemContainer>
          </MenuContainer>
        </Container>
      </Modal>
    </VStack>
  );
};

const LOGO_SMALL = require("../../../assets/images/logoSmall.png");
