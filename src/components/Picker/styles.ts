import * as React from "react";
import { Text, TextProps, TouchableOpacity, View } from "react-native";
import styled from "styled-components";
import { colors, fonts, metrics } from "../../styles";

export const SpaceItems = styled(TouchableOpacity)`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const StyledInput = styled(View)`
  width: 100%;
  height: 45px;
  padding: 5px 20px;
  justify-content: center;
  border-radius: ${metrics.mediumRadius}px;
  border: 2px solid ${colors.lightGray};
  font-family: ${fonts.ralewayExtraBold};
  font-size: ${fonts.regular}px;
  margin-bottom: ${metrics.baseMargin}px;
  color: ${({ theme }) => theme.theme.text};
`;

export const PickerText: React.FC<
  TextProps & { value: string; type: string }
> = styled(Text)`
  font-family: ${fonts.ralewayExtraBold};
  font-size: ${fonts.regular}px;
  color: ${({ theme, value, type }) =>
    value === type ? colors.lightGray : theme.theme.text};
`;

export const ModalContainer = styled(View)`
  flex: 1;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.theme.transparency};
`;

export const ContentView = styled(View)`
  padding: ${metrics.topBottomPadding}px ${metrics.basePadding}px;
  width: 294px;
  background-color: ${({ theme }) => theme.theme.primary};
  border-radius: ${metrics.baseRadius}px;
`;

export const Title = styled(Text)`
  font-family: ${fonts.ralewayExtraBold};
  font-size: ${fonts.large}px;
  color: ${({ theme }) => theme.theme.blue};
  margin-left: ${metrics.baseMargin}px;
  margin-bottom: ${metrics.baseMargin}px;
`;

export const ItemPicker = styled(TouchableOpacity)`
  flex-direction: row;
  justify-content: space-between;
  padding: ${metrics.basePadding}px;
  border-bottom-width: 1px;
  border-bottom-color: ${colors.lightGray};
  margin-bottom: ${metrics.baseMargin};
`;

export const ItemText = styled(Text)`
  font-family: ${fonts.ralewayBold};
  font-size: ${fonts.regular}px;
  color: ${({ theme }) => theme.theme.text};
`;
