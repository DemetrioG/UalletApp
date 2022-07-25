import * as React from "react";
import { View } from "react-native";
import styled from "styled-components";
import DateTimePicker, {
  AndroidNativeProps,
  IOSNativeProps,
} from "@react-native-community/datetimepicker";
import { colors, fonts, metrics } from "../../styles";
import { Text } from "native-base";

export const DateHeader = styled(View)`
  width: 100%;
  padding: ${metrics.basePadding}px;
  justify-content: flex-end;
  align-items: flex-end;
  background-color: ${({ theme: { theme } }) => theme.primary};
  border-bottom-width: 1px;
  border-color: ${colors.lightGray};
  border-top-left-radius: ${metrics.baseRadius}px;
  border-top-right-radius: ${metrics.baseRadius}px;
`;

export const DateText = styled(Text).attrs(() => ({
  fontWeight: 700,
  fontSize: fonts.regular
}))`
  color: ${({ theme: { theme } }) => theme.text};
`;

export const StyledDatePicker: React.FC<
  AndroidNativeProps | IOSNativeProps
> = styled(DateTimePicker)`
  background-color: ${({ theme: { theme } }) => theme.primary};
`;
