import { Text } from "react-native";
import styled from "styled-components";
import { fonts } from "../../../../../styles";

export const InfoNumber = styled(Text)`
  font-family: ${fonts.montserratBold};
  color: ${({ theme: { theme } }) => theme.red};
`;
