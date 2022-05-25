import { Text, View } from "react-native";
import styled from "styled-components";
import { colors, fonts, metrics } from "../../styles";

export const HeaderContainer = styled(View)`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export const InputContainer = styled(View)`
  margin-top: ${metrics.baseMargin}px;
`;

export const Title = styled(Text)`
  font-family: ${fonts.ralewayBold};
  font-size: ${fonts.large}px;
  color: ${({ theme: { theme } }) => theme.text};
`;

export const DateContainer = styled(HeaderContainer)``;

export const LabelContainer = styled(HeaderContainer)`
  padding: ${metrics.basePadding}px;
`;

export const LabelText = styled(Text)`
  font-family: ${fonts.ralewayBold};
  font-size: ${fonts.medium}px;
  color: ${colors.gray};
`;

export const LabelValue = styled(Text)`
  font-family: ${fonts.montserratBold};
  font-size: ${fonts.large}px;
  color: ${({ theme: { theme } }) => theme.blue};
`;

export const ButtonContainer = styled(View)`
  padding-top: ${metrics.topBottomPadding}px;
  align-items: center;
  justify-content: center;
`;
