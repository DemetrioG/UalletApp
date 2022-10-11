import { TouchableOpacity } from "react-native";
import { HStack, Text } from "native-base";
import styled from "styled-components";
import { colors, metrics } from "../../styles";

export const ItemPicker = styled(TouchableOpacity)`
  flex-direction: row;
  justify-content: space-between;
  padding: ${metrics.basePadding}px;
  border-bottom-width: 1px;
  border-bottom-color: ${colors.lightGray};
  margin-bottom: ${metrics.baseMargin}px;
`;
export const TextItem = styled(Text).attrs<{ type: "Mês" | "Ano" }>(
  ({ type }) => ({
    fontFamily: type === "Ano" ? "mono" : "body",
    fontWeight: 700,
  })
)``;

export const HeaderView = styled(HStack)`
  margin: 0px ${metrics.baseMargin}px ${metrics.baseMargin}px;
  justify-content: space-between;
`;

export const Title = styled(Text).attrs(() => ({
  fontFamily: "body",
  fontWeight: 800,
}))`
  color: ${({ theme: { theme } }) => theme.blue};
`;
