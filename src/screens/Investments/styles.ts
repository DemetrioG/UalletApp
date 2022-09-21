import { Text } from "native-base";
import styled from "styled-components";

export const Title = styled(Text).attrs(() => ({
  fontSize: "md",
}))`
  color: ${({ theme: { theme } }) => theme.text};
`;

export const PatrimonyText = styled(Text).attrs(() => ({
  fontSize: "lg",
  fontWeight: 700,
}))`
  color: ${({ theme: { theme } }) => theme.text};
`;
