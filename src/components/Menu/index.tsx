import * as React from "react";
import { Pressable, Text } from "native-base";
import { useTheme } from "styled-components";
import Modal from "react-native-modal";

import Icon from "../Icon";
import { ConfirmContext } from "../../context/ConfirmDialog/confirmContext";
import { DataContext } from "../../context/Data/dataContext";
import { initialUserState, UserContext } from "../../context/User/userContext";
import {
  initialLoaderState,
  LoaderContext,
} from "../../context/Loader/loaderContext";
import { removeAllStorage } from "../../utils/storage.helper";
import {
  Avatar,
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
import { IThemeProvider } from "../../styles/baseTheme";
import { useNavigation } from "@react-navigation/native";
import { refreshAuthDevice } from "./query";

const Menu = () => {
  const { navigate } = useNavigation();
  const { data, setData } = React.useContext(DataContext);
  const {
    loader: { homeVisible },
    setLoader,
  } = React.useContext(LoaderContext);
  const { setConfirm } = React.useContext(ConfirmContext);
  const { user, setUser } = React.useContext(UserContext);

  const [visible, setVisible] = React.useState(false);

  const { theme }: IThemeProvider = useTheme();

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
    <>
      <Pressable onPress={() => setVisible(!visible)}>
        <Avatar backgroundColor={theme?.secondary}>
          <Text fontSize={"sm"} fontWeight={700}>
            {homeVisible ? "-" : user.name[0]}
          </Text>
        </Avatar>
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
    </>
  );
};

export default Menu;
