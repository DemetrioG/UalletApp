import { Text } from "native-base";
import styled from "styled-components";

export const InfoText = styled(Text).attrs(() => ({
  fontSize: "md",
}))`
  color: ${({ theme: { theme } }) => theme.text};
`;
