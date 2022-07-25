import * as React from "react";
import { Pressable, useContrastText } from "native-base";
import { useTheme } from "styled-components";
import Modal from "react-native-modal";

import Icon from "../Icon";
import { AlertContext } from "../../context/Alert/alertContext";
import { DateContext } from "../../context/Date/dateContext";
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

const Menu = () => {
  const { date, setDate } = React.useContext(DateContext);
  const { loader } = React.useContext(LoaderContext);
  const { setAlert } = React.useContext(AlertContext);
  const { user, setUser } = React.useContext(UserContext);

  const [visible, setVisible] = React.useState(false);

  const { theme }: IThemeProvider = useTheme();

  function changeModality() {
    return setDate((dateState) => ({
      ...dateState,
      modality: dateState.modality === "Real" ? "Projetado" : "Real",
    }));
  }

  async function handleLogout() {
    setVisible(false);
    await new Promise((resolve) => setTimeout(resolve, 500));
    return setAlert(() => ({
      title: "Deseja realmente sair do app?",
      type: "confirm",
      visibility: true,
      callbackFunction: logout,
    }));
  }

  function logout() {
    setUser(() => ({
      ...initialUserState,
    }));
    removeAllStorage();
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
                <ItemText>{date.modality}</ItemText>
                <Icon name="refresh-cw" size={16} />
              </ItemContent>
            </ItemContainer>
            <ItemContainer>
              <ItemContent>
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
