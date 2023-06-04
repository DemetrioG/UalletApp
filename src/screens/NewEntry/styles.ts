import { Text as NativeText, TouchableOpacity } from "react-native";
import { Text } from "native-base";
import styled from "styled-components";
import { colors, fonts, metrics } from "../../styles";

export const ChangeType = styled(TouchableOpacity)`
  margin-top: 5px;
  margin-left: ${metrics.baseMargin}px;
`;

export const Schema = styled(NativeText)`
  font-family: ${fonts.montserratExtraBold};
`;

export const FixEntryText = styled(Text).attrs(() => ({
  fontWeight: 700,
}))`
  color: ${colors.gray};
`;
