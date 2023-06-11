import { TouchableOpacity, Image } from "react-native";
import { Flex } from "native-base";
import styled from "styled-components";

import { metrics } from "../../../styles";

export const SheetView = styled(Flex)`
  width: 100%;
  height: 60px;
  margin-top: ${metrics.baseMargin}px;
  flex-direction: row;
  justify-content: space-around;
`;

export const SocialContainer = styled(TouchableOpacity)<{
  backgroundColor: string;
}>`
  padding: 8px;
  width: 70px;
  height: 50px;
  align-items: center;
  justify-content: center;
  border-radius: ${metrics.baseRadius}px;
  background-color: ${({ backgroundColor }) => backgroundColor};
`;

export const AppleLogo = styled(Image)`
  width: 48%;
  height: 90%;
  margin-bottom: 2px;
`;

export const FacebookLogo = styled(Image)`
  width: 50%;
  height: 100%;
`;

export const GoogleLogo = styled(Image)`
  width: 60%;
  height: 100%;
`;
