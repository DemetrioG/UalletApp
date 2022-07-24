import * as React from "react";
import { Text } from "native-base";
import { TextProps, TouchableOpacity, View } from "react-native";
import styled from "styled-components";
import { colors, fonts, metrics } from "../../styles";

export const SpaceItems = styled(TouchableOpacity)`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const StyledInput = styled(View)`
  height: 40px;
  padding: 5px 14px;
  justify-content: center;
  border-radius: 6.5px;
  border: 1px solid ${colors.gray};
  font-family: ${fonts.ralewayBold};
  font-size: ${fonts.regular}px;
  margin-bottom: ${metrics.baseMargin}px;
  color: ${({ theme: { theme } }) => theme.text};
`;

export const PickerText: React.FC<
  TextProps & { value: string; type: string }
> = styled(Text).attrs(() => ({
  fontWeight: 700,
  fontSize: fonts.regular,
}))`
  color: ${({ theme, value, type }) =>
    value.replace(" *", "") === type ? colors.gray : theme.theme.text};
`;

export const Title = styled(Text).attrs(() => ({
  fontWeight: 700,
}))`
  color: ${({ theme: { theme } }) => theme.blue};
  margin: ${metrics.baseMargin}px;
`;

export const ItemPicker = styled(TouchableOpacity)`
  flex-direction: row;
  justify-content: space-between;
  padding: ${metrics.basePadding}px;
  border-bottom-width: 1px;
  border-bottom-color: ${colors.lightGray};
  margin-bottom: ${metrics.baseMargin}px;
`;

export const ItemText = styled(Text).attrs(() => ({
  fontWeight: 700,
  fontSize: fonts.regular,
}))`
  color: ${({ theme: { theme } }) => theme.text};
`;
