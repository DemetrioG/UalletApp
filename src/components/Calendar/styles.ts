import { View } from "react-native";
import { Text } from "native-base";
import styled from "styled-components";
import DateTimePicker from "@react-native-community/datetimepicker";
import { colors, fonts, metrics } from "../../styles";

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
  fontSize: fonts.regular,
}))``;

export const StyledDatePicker = styled(DateTimePicker)`
  background-color: ${({ theme: { theme } }) => theme.primary};
`;
