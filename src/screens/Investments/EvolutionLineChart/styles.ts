import { Text, VStack } from "native-base";
import styled from "styled-components";
import { metrics } from "../../../styles";

export const Wrapper = styled(VStack)`
  background-color: ${({ theme: { theme } }) => theme.primary};
  border-top-left-radius: ${metrics.baseRadius}px;
  border-top-right-radius: ${metrics.baseRadius}px;
`;

export const Income = styled(Text).attrs(() => ({
  fontSize: "md",
  fontFamily: "mono",
  fontWeight: 500,
}))`
  color: ${({ theme: { theme } }) => theme.green};
`;

export const CompleteWrapper = styled(VStack)`
  background-color: ${({ theme: { theme } }) => theme.secondary};
  border: 1px solid ${({ theme: { theme } }) => theme.primary};
  border-bottom-left-radius: ${metrics.baseRadius}px;
  border-bottom-right-radius: ${metrics.baseRadius}px;
`;
