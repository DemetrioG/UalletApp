import { HStack, Text } from "native-base";
import * as React from "react";
import {
  TextProps,
} from "react-native";
import styled from "styled-components";
import { fonts } from "../../styles";

export const HorizontalView = styled(HStack)`
  align-items: center;
  margin-bottom: 5px;
`;

export const TypeView = styled(HStack)`
  align-items: center;
  margin-left: 35px;
`;

export const TypeText: React.FC<TextProps> = styled(Text).attrs(() => ({
  fontWeight: 800
}))`
  font-size: ${fonts.largeEmphasis}px;
  color: ${({ theme: { theme } }) => theme.blue};
`;
