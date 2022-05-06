import * as React from "react";
import { DateContext } from "../../context/Date/dateContext";
import { UserContext } from "../../context/User/userContext";
import { removeStorage } from "../../functions/storageData";
import { colors } from "../../styles";
import { StyledIcon } from "../../styles/general";
import {
  ItemContainer,
  ItemContent,
  ItemText,
  LogoutText,
  MenuContainer,
} from "./styles";

export default function Menu({ visibility }: { visibility: boolean }) {
  const { date, setDate } = React.useContext(DateContext);
  const { user, setUser } = React.useContext(UserContext);

  function changeModality() {
    setDate((dateState) => ({
      ...dateState,
      modality: dateState.modality === "Real" ? "Projetado" : "Real",
    }));
  }

  function logout() {
    removeStorage("authUser");
    setUser((userState) => ({
      signed: false,
      complete: false,
      uid: undefined,
      name: "",
    }));
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
            <ItemContent onPress={logout}>
              <LogoutText>LOGOUT</LogoutText>
              <StyledIcon name="power" size={15} color={colors.lightRed} />
            </ItemContent>
          </ItemContainer>
        </MenuContainer>
      )}
    </>
  );
}
