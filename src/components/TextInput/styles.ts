import { Text } from "react-native";
import styled from "styled-components";
import { fonts, metrics } from "../../styles";

export const TextError = styled(Text)`
  font-family: ${fonts.ralewayExtraBold};
  font-size: ${fonts.regular}px;
  color: ${({ theme: { theme } }) => theme.red};
  margin-bottom: ${metrics.baseMargin}px;
`;
