import { View } from "react-native";
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

export const BalanceText = styled(Text).attrs(() => ({
  fontFamily: "mono",
  fontWeight: 700,
}))<{ negative?: boolean }>`
  color: ${({ theme: { theme }, negative }) =>
    !negative ? theme.blue : theme.red};
  margin-left: ${metrics.baseMargin / 2}px;
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

export const TotalValueContainer = styled(View)`
  justify-content: flex-end;
`;
