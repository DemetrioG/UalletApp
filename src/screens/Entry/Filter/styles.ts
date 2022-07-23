import { Text } from "native-base";
import { View } from "react-native";
import styled from "styled-components";
import { colors, fonts, metrics } from "../../../styles";

export const SpaceContainer = styled(View)`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export const InputContainer = styled(View)`
  margin-top: ${metrics.baseMargin}px;
`;

export const Title = styled(Text).attrs(({ theme: { theme } }) => ({
  fontWeight: 700,
  fontSize: "md",
  color: theme.text,
}))``;

export const LabelContainer = styled(SpaceContainer)`
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

export const InputDateContainer = styled(View)`
  width: 48%;
`;
