import { Text as NativeText, TouchableOpacity } from "react-native";
import { HStack, Text } from "native-base";
import styled from "styled-components";
import { colors, fonts, metrics } from "../../styles";

export const HorizontalView = styled(HStack)`
  align-items: center;
`;

export const TypeText = styled(Text).attrs(() => ({
  fontWeight: 700,
  fontSize: "lg",
}))<{ type?: "Receita" | "Despesa" }>`
  min-width: 80px;
  color: ${({ theme, type }) =>
    type === "Receita" ? theme.theme.green : theme.theme.red};
`;

export const ChangeType = styled(TouchableOpacity)`
  margin-top: 5px;
  margin-left: ${metrics.baseMargin}px;
`;

export const Schema = styled(NativeText)`
  font-family: ${fonts.ralewayExtraBold};
`;

export const FixEntryText = styled(Text).attrs(() => ({
  fontWeight: 700,
}))`
  color: ${colors.gray};
`;
