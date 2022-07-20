import * as React from "react";
import { Menu as NativeMenu, Pressable, useContrastText } from "native-base";

import { AlertContext } from "../../context/Alert/alertContext";
import { DateContext } from "../../context/Date/dateContext";
import { initialUserState, UserContext } from "../../context/User/userContext";
import { removeAllStorage } from "../../utils/storage.helper";
import { colors, metrics } from "../../styles";
import {
  Avatar,
  AvatarText,
  ItemContainer,
  ItemContent,
  ItemText,
  LogoutText,
} from "./styles";
import { Icon } from "../../styles/general";
import { LoaderContext } from "../../context/Loader/loaderContext";

const RANDOM_COLOR = "#" + Math.floor(Math.random() * 16777215).toString(16);

export default function Menu() {
  const { date, setDate } = React.useContext(DateContext);
  const { loader } = React.useContext(LoaderContext);
  const { setAlert } = React.useContext(AlertContext);
  const { user, setUser } = React.useContext(UserContext);

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
        boxSize={"full"}
        rounded={"lg"}
        minWidth={180}
        top={metrics.baseMargin}
        right={metrics.basePadding}
        trigger={(props) => {
          return (
            <Pressable {...props}>
              <Avatar backgroundColor={RANDOM_COLOR}>
                <AvatarText color={useContrastText(RANDOM_COLOR)}>
                  {loader.visible ? "-" : user.name[0]}
                </AvatarText>
              </Avatar>
            </Pressable>
          );
        }}
      >
        <NativeMenu.Item isDisabled>
          <ItemContainer>
            <ItemContent onPress={changeModality}>
              <ItemText>{date.modality}</ItemText>
              <Icon name="refresh-cw" size={15} color={colors.white} />
            </ItemContent>
          </ItemContainer>
        </NativeMenu.Item>
        <NativeMenu.Item isDisabled>
          <ItemContainer>
            <ItemContent>
              <ItemText>Configurações</ItemText>
              <Icon name="settings" size={15} color={colors.white} />
            </ItemContent>
          </ItemContainer>
        </NativeMenu.Item>
        <NativeMenu.Item isDisabled>
          <ItemContainer>
            <ItemContent onPress={handleLogout}>
              <LogoutText>Logout</LogoutText>
              <Icon name="power" size={15} color={colors.lightRed} />
            </ItemContent>
          </ItemContainer>
        </NativeMenu.Item>
      </NativeMenu>
    </>
  );
}
