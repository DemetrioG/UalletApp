import * as React from "react";
import {
  Text,
  TextProps,
  TouchableOpacity,
  View,
  ViewProps,
} from "react-native";
import styled from "styled-components";
import { fonts, metrics } from "../../styles";

export const HorizontalView: React.FC<
  ViewProps & { noMarginBottom?: boolean }
> = styled(View)`
  flex-direction: row;
  align-items: center;
  margin-bottom: ${({ noMarginBottom }) =>
    noMarginBottom ? 0 : metrics.baseMargin}px;
`;

export const TypeView = styled(View)`
  flex-direction: row;
  align-items: center;
  margin-left: 35px;
`;

export const TypeText: React.FC<
  TextProps & { type?: "Receita" | "Despesa" }
> = styled(Text)`
  font-family: ${fonts.ralewayExtraBold};
  font-size: ${fonts.largeEmphasis}px;
  color: ${({ theme, type }) =>
    type === "Receita" ? theme.theme.green : theme.theme.red};
`;

export const ChangeType = styled(TouchableOpacity)`
  margin-top: 5px;
  margin-left: ${metrics.baseMargin}px;
`;
