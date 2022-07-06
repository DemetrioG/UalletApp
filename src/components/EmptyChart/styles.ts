import { Text, View } from "react-native";
import styled from "styled-components";
import { fonts, metrics } from "../../styles";

export const ContainerCenter = styled(View)`
  align-items: center;
  justify-content: center;
`;

const DefaultText = styled(Text)`
  margin-top: ${metrics.baseMargin}px;
  text-align: center;
  color: ${({ theme: { theme } }) => theme.text};
`;

export const EmphasisText = styled(DefaultText)`
  font-family: ${fonts.ralewayBold};
  font-size: ${fonts.medium}px;
`;

export const HelperText = styled(DefaultText)`
  font-family: ${fonts.ralewayBold};
  font-size: ${fonts.regular}px;
  color: ${({ theme: { theme } }) => theme.blue};
`;
