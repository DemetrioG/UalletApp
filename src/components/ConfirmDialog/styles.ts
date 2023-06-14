import { Center, HStack, Text } from "native-base";
import styled from "styled-components";
import { colors, fonts, metrics } from "../../styles";
import { ButtonDeleteSmall, ButtonSmall, ModalView as DefaultModalView } from "../../styles/general";

export const ModalView = styled(DefaultModalView)`
  padding: 30px 20px;
  width: 95%;
  border-left-width: 8px;
  border-left-color: ${({theme: {theme}}) => theme.isOnDarkTheme ? colors.strongRed : colors.lightRed};
  background-color: ${({theme: {theme}}) => theme.isOnDarkTheme ? colors.lightPrimary : colors.darkSecondary}
`

export const TextAlert = styled(Text)`
  font-size: ${fonts.large}px;
  margin-bottom: ${metrics.doubleBaseMargin}px;
  text-align: center;
  color: ${({ theme: { theme } }) => theme.isOnDarkTheme ? colors.darkPrimary : colors.white};
`;

export const ButtonContainer = styled(HStack)`
  width: 90%;
  justify-content: space-around;
`;

export const StyledButtonConfirm = styled(ButtonSmall)`
  margin-bottom: 0px;
  width: 100px;
  height: 35px;
`;

export const StyledButtonDelete = styled(ButtonDeleteSmall)`
  background-color: ${({theme: {theme}}) => theme.isOnDarkTheme ? colors.strongRed : colors.lightRed};
  margin-bottom: 0px;
  width: 100px;
  height: 35px;
`;

export const Container = styled(Center)`
  width: 100%;
  position: absolute;
  top: 0px;
  bottom: 0;
  margin-top: auto;
  margin-bottom: auto;
`
