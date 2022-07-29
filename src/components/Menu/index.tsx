import * as React from "react";
import { Pressable, useContrastText } from "native-base";
import { useTheme } from "styled-components";
import Modal from "react-native-modal";

import Icon from "../Icon";
import { AlertContext } from "../../context/Alert/alertContext";
import { DataContext } from "../../context/Data/dataContext";
import { initialUserState, UserContext } from "../../context/User/userContext";
import { LoaderContext } from "../../context/Loader/loaderContext";
import { removeAllStorage } from "../../utils/storage.helper";
import {
  Avatar,
  AvatarMenu,
  AvatarMenuText,
  AvatarText,
  Container,
  Email,
  ItemContainer,
  ItemContent,
  ItemText,
  MenuContainer,
  Name,
  ProfileContainer,
} from "./styles";
import { IThemeProvider } from "../../../App";
import { useNavigation } from "@react-navigation/native";

const Menu = () => {
  const { navigate } = useNavigation();
  const { data, setData } = React.useContext(DataContext);
  const { loader } = React.useContext(LoaderContext);
  const { setAlert } = React.useContext(AlertContext);
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
    removeAllStorage()
      .then(() => {})
      .catch(() => {})
      .finally(() => setUser(initialUserState));
  }

  function handleLogout() {
    setVisible(false);
    setTimeout(() => {
      setAlert({
        title: "Deseja realmente sair do app?",
        type: "confirm",
        visibility: true,
        callbackFunction: logout,
      });
    }, 500);
  };

  function goToConfiguracoesScreen() {
    setVisible(false);
    //#TODO: adicionar tipagem de navegação
    return setTimeout(() => navigate("Configuracoes" as any), 150);
  }

  return (
    <>
      <Pressable onPress={() => setVisible(!visible)}>
        <Avatar backgroundColor={theme?.randomColor}>
          <AvatarText color={useContrastText(theme?.randomColor!)}>
            {loader.visible ? "-" : user.name[0]}
          </AvatarText>
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
                <Icon name="refresh-cw" size={16} />
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
