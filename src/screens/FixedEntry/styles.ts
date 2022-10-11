import { HStack, Text } from "native-base";
import * as React from "react";
import { TextProps } from "react-native";
import styled from "styled-components";

export const TypeView = styled(HStack)`
  align-items: center;
  margin-left: 35px;
`;

export const TypeText: React.FC<TextProps> = styled(Text).attrs(() => ({
  fontWeight: 800,
  fontSize: "lg",
}))`
  color: ${({ theme: { theme } }) => theme.blue};
`;
