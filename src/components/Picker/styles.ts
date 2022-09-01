import * as React from "react";
import { Text } from "native-base";
import { TextProps, TouchableOpacity, View } from "react-native";
import styled from "styled-components";
import { colors, fonts, metrics } from "../../styles";
import { IViewProps } from "native-base/lib/typescript/components/basic/View/types";

export const SpaceItems = styled(TouchableOpacity)`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const StyledInput: React.FC<
  IViewProps & { isInvalid: boolean }
> = styled(View)`
  height: 40px;
  padding: 5px 14px;
  justify-content: center;
  border-radius: 6.5px;
  border: 1px solid
    ${({ isInvalid }) => (isInvalid ? colors.invalidInputColor : colors.gray)};
  font-family: ${fonts.ralewayBold};
  font-size: ${fonts.regular}px;
  color: ${({ theme: { theme } }) => theme.text};
`;

export const PickerText: React.FC<
  TextProps & { value: string; type: string }
> = styled(Text).attrs(() => ({
  fontWeight: 700,
  fontSize: fonts.regular,
}))`
  color: ${({ theme, value, type }) =>
    value === type ? colors.gray : theme.theme.text};
`;

export const Title = styled(Text).attrs(() => ({
  fontWeight: 700,
}))`
  color: ${({ theme: { theme } }) => theme.blue};
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
