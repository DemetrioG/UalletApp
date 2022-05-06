import React from "react";
import { Text, TextProps, TouchableOpacity, View } from "react-native";
import styled from "styled-components";
import { colors, fonts, metrics } from "../../styles";

export const ItemPicker = styled(TouchableOpacity)`
  flex-direction: row;
  justify-content: space-between;
  padding: ${metrics.basePadding}px;
  border-bottom-width: 1px;
  border-bottom-color: ${colors.lightGray};
  margin-bottom: ${metrics.baseMargin}px;
`;
export const TextItem: React.FC<TextProps & { type: "Mês" | "Ano" }> = styled(
  Text
)`
  font-family: ${({ type }) =>
    type === "Ano" ? fonts.montserratBold : fonts.ralewayBold};
  font-size: ${fonts.regular}px;
  color: ${({ theme }) => theme.theme.text};
`;

export const HeaderView = styled(View)`
  flex-direction: row;
  margin: 0px ${metrics.baseMargin}px ${metrics.baseMargin}px;
  justify-content: space-between;
`;

export const Title = styled(Text)`
  font-family: ${fonts.ralewayExtraBold};
  font-size: ${fonts.large}px;
  color: ${({ theme }) => theme.theme.blue};
`;
