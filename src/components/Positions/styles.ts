import { Text, VStack } from "native-base";
import styled from "styled-components";
import { colors, metrics } from "../../styles";

export const Header = styled(VStack)`
  z-index: 2;
  width: 100%;
  position: absolute;
  border-radius: ${metrics.baseRadius}px;
  padding: ${metrics.basePadding}px;
  background-color: ${({ theme: { theme } }) => theme.primary};
  justify-content: center;
`;

export const Container = styled(VStack)`
  border-bottom-left-radius: ${metrics.baseRadius}px;
  border-bottom-right-radius: ${metrics.baseRadius}px;
  padding: ${metrics.basePadding}px;
  background-color: ${({ theme: { theme } }) => theme.primary};
  max-height: ${metrics.screenHeight / 3.5}px;
  margin-top: 100px;
`;

export const ItemContainer = styled(VStack)`
  padding: 8px 10px;
  align-items: center;
  height: 40px;
`;

export const Label = styled(Text).attrs(() => ({
  fontWeight: 700,
}))`
  color: ${({ theme: { theme } }) => theme.text};
`;

export const ItemContent = styled(Text).attrs<{ number?: boolean }>(
  ({ number }) => ({
    fontFamily: number ? "mono" : "body",
  })
)<{ number?: boolean; withColor?: boolean; negative?: boolean }>`
  color: ${({ withColor, negative, theme: { theme } }) =>
    withColor ? (negative ? theme.red : theme.green) : theme.text};
`;

export const EmptyText = styled(Text)`
  margin: ${metrics.baseMargin}px;
  text-align: center;
  color: ${colors.gray};
`;

export const TotalLabel = styled(Text).attrs(() => ({
  fontWeight: 700,
}))`
  color: ${colors.gray};
`;

export const TotalValue = styled(Text).attrs(() => ({
  fontFamily: "mono",
}))`
  color: ${colors.gray};
`;

export const TotalPercentual = styled(Text).attrs(() => ({
  fontFamily: "mono",
}))<{ negative?: boolean }>`
  color: ${({ negative, theme: { theme } }) =>
    !negative ? theme.green : theme.red};
`;
