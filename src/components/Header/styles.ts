import { Text, View } from "react-native";
import styled from "styled-components";
import { fonts, metrics } from "../../styles";

export const HeaderView = styled(View)`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${metrics.baseMargin}px;
  padding-left: ${metrics.basePadding}px;
  z-index: 5;
`;

export const HeaderText = styled(Text)`
  font-family: ${fonts.ralewayMedium};
  font-size: ${fonts.medium}px;
  color: ${({ theme: { theme } }) => theme.text};
`;

export const HeaderIconView = styled(View)`
  width: 110px;
  flex-direction: row;
  justify-content: space-between;
  min-width: 140px;
`;
