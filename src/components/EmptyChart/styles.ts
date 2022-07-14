import { Text } from "native-base";
import styled from "styled-components";
import { metrics } from "../../styles";

export const DefaultText = styled(Text)`
  margin-top: ${metrics.baseMargin}px;
  text-align: center;
  color: ${({ theme: { theme } }) => theme.text};
`;

export const HelperText = styled(DefaultText).attrs(() => ({
  fontWeight: 700,
}))`
  color: ${({ theme: { theme } }) => theme.blue};
`;
