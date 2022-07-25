import * as React from "react";
import { Pressable, useContrastText } from "native-base";
import { useTheme } from "styled-components";

import Icon from "../Icon";
import { AlertContext } from "../../context/Alert/alertContext";
import { DateContext } from "../../context/Date/dateContext";
import { initialUserState, UserContext } from "../../context/User/userContext";
import { LoaderContext } from "../../context/Loader/loaderContext";
import { removeAllStorage } from "../../utils/storage.helper";
import { colors, metrics } from "../../styles";
import {
  Avatar,
  AvatarText,
  ItemContainer,
  ItemContent,
  ItemText,
  LogoutText,
  NativeMenu,
  NativeMenuItem,
} from "./styles";
import { IThemeProvider } from "../../../App";

const Menu = () => {
  const { date, setDate } = React.useContext(DateContext);
  const { loader } = React.useContext(LoaderContext);
  const { setAlert } = React.useContext(AlertContext);
  const { user, setUser } = React.useContext(UserContext);

  const { theme }: IThemeProvider = useTheme();

  const itemTextColor = theme?.isOnDarkTheme
    ? colors.white
    : colors.darkPrimary;

  function changeModality() {
    return setDate((dateState) => ({
      ...dateState,
      modality: dateState.modality === "Real" ? "Projetado" : "Real",
    }));
  }

  function handleLogout() {
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
      <NativeMenu
        trigger={(props) => {
          return (
            <Pressable {...props}>
              <Avatar backgroundColor={theme?.randomColor}>
                <AvatarText color={useContrastText(theme?.randomColor!)}>
                  {loader.visible ? "-" : user.name[0]}
                </AvatarText>
              </Avatar>
            </Pressable>
          );
        }}
      >
        <NativeMenuItem isDisabled>
          <ItemContainer>
            <ItemContent onPress={changeModality}>
              <ItemText style={{ color: itemTextColor }}>
                {date.modality}
              </ItemText>
              <Icon name="refresh-cw" size={15} color={itemTextColor} />
            </ItemContent>
          </ItemContainer>
        </NativeMenuItem>
        <NativeMenuItem isDisabled>
          <ItemContainer>
            <ItemContent>
              <ItemText style={{ color: itemTextColor }}>
                Configurações
              </ItemText>
              <Icon name="settings" size={15} color={itemTextColor} />
            </ItemContent>
          </ItemContainer>
        </NativeMenuItem>
        <NativeMenuItem isDisabled>
          <ItemContainer>
            <ItemContent onPress={handleLogout}>
              <LogoutText>Logout</LogoutText>
              <Icon name="power" size={15} color={colors.lightRed} />
            </ItemContent>
          </ItemContainer>
        </NativeMenuItem>
      </NativeMenu>
    </>
  );
};

export default Menu;
