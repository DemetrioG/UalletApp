import * as React from "react";
import { TextProps, View } from "react-native";
import { Center, Pressable, Text } from "native-base";
import styled from "styled-components";
import { metrics } from "../../styles";

export const MoreContainer = styled(Center)`
  flex: 1;
`;

export const LoadingText = styled(Text).attrs(() => ({
  fontWeight: 700,
}))`
  color: ${({ theme: { theme } }) => theme.blue};
`;

export const TotalItemContainer = styled(View)`
  flex-direction: row;
  align-items: baseline;
  justify-content: space-between;
  padding: 6px 0px;
`;

export const BalanceText: React.FC<TextProps & { negative?: boolean }> = styled(
  Text
).attrs(() => ({
  fontFamily: "mono",
  fontWeight: 700,
}))`
  color: ${({ theme: { theme }, negative }) =>
    !negative ? theme.blue : theme.red};
  margin-left: ${metrics.baseMargin / 2}px;
`;

export const RemoveFilterText = styled(Text)`
  color: ${({ theme: { theme } }) => theme.text};
  margin-right: 3px;
`;

export const RemoveFilterButton = styled(Pressable)`
  flex-direction: row;
  align-items: baseline;
  margin-bottom: 10px;
`;

export const HeaderContainer = styled(View)`
  flex-direction: row;
  align-items: baseline;
`;

export const InfoMonthText = styled(Text).attrs(() => ({
  fontWeight: 700,
  fontSize: "md",
}))`
  color: ${({ theme: { theme } }) => theme.text};
  margin-left: 5px;
`;

export const LastEntryText = styled(Text).attrs(() => ({
  fontSize: "md",
}))`
  color: ${({ theme: { theme } }) => theme.text};
  margin-bottom: ${metrics.baseMargin}px;
`;

export const TotalLabelText = styled(Text)`
  color: ${({ theme: { theme } }) => theme.text};
  margin-right: 10px;
`;

export const TotalText = styled(Text).attrs(() => ({
  fontFamily: "mono",
}))`
  color: ${({ theme: { theme } }) => theme.text};
`;

export const TotalValueContainer = styled(View)`
  justify-content: flex-end;
`;
