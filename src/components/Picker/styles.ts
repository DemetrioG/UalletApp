import { Text } from "native-base";
import { TouchableOpacity, View } from "react-native";
import styled from "styled-components";
import { colors, fonts, metrics } from "../../styles";

export const SpaceItems = styled(TouchableOpacity)`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const StyledInput = styled(View)<{ isInvalid: boolean }>`
  height: 40px;
  padding: 5px 14px;
  justify-content: center;
  border-radius: 6.5px;
  border: 1px solid
    ${({ isInvalid }) => (isInvalid ? colors.invalidInputColor : colors.gray)};
  font-family: ${fonts.montserratBold};
  font-size: ${fonts.regular}px;
`;

export const PickerText = styled(Text).attrs(() => ({
  fontWeight: 700,
  fontSize: fonts.regular,
}))<{ value: string; type: string }>`
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
