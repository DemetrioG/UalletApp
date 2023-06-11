import { Text } from "native-base";
import styled from "styled-components";
import { metrics } from "../../../../styles";

export const Total = styled(Text).attrs(() => ({
  fontWeight: 700,
  fontFamily: "mono",
  fontSize: "md",
}))`
  color: ${({ theme: { theme } }) => theme.blue};
  margin-left: ${metrics.baseMargin}px;
`;
