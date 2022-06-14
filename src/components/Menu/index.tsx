import * as React from "react";
import { AlertContext } from "../../context/Alert/alertContext";
import { DateContext } from "../../context/Date/dateContext";
import { initialUserState, UserContext } from "../../context/User/userContext";
import { colors } from "../../styles";
import { StyledIcon } from "../../styles/general";
import { removeAllStorage } from "../../utils/storage.helper";
import {
  ItemContainer,
  ItemContent,
  ItemText,
  LogoutText,
  MenuContainer,
} from "./styles";

export default function Menu({ visibility }: { visibility: boolean }) {
  const { date, setDate } = React.useContext(DateContext);
  const { setAlert } = React.useContext(AlertContext);
  const { setUser } = React.useContext(UserContext);

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
      {visibility && (
        <MenuContainer>
          <ItemContainer>
            <ItemContent onPress={changeModality}>
              <ItemText>{date.modality}</ItemText>
              <StyledIcon name="refresh-cw" size={15} color={colors.white} />
            </ItemContent>
          </ItemContainer>
          <ItemContainer>
            <ItemContent>
              <ItemText>Configurações</ItemText>
              <StyledIcon name="settings" size={15} color={colors.white} />
            </ItemContent>
          </ItemContainer>
          <ItemContainer>
            <ItemContent onPress={handleLogout}>
              <LogoutText>LOGOUT</LogoutText>
              <StyledIcon name="power" size={15} color={colors.lightRed} />
            </ItemContent>
          </ItemContainer>
        </MenuContainer>
      )}
    </>
  );
}
