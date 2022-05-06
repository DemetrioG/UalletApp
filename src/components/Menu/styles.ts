import {
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
} from "react-native";
import styled from "styled-components";
import { colors, fonts, metrics } from "../../styles";

export const IconContainer = styled(TouchableOpacity)`
  margin-left: ${metrics.baseMargin}px;
`;

export const MenuContainer = styled(View)`
  padding: ${metrics.basePadding}px;
  position: absolute;
  right: 10px;
  top: 60px;
  background-color: ${colors.infoBlack};
  border-radius: ${metrics.baseRadius}px;
  width: 200px;
  z-index: 5;
`;

export const ItemContainer = styled(View)`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: ${metrics.basePadding}px 10px;
  border-bottom-width: 1px;
  border-color: ${colors.gray};
`;

export const ItemText = styled(Text)`
  font-family: ${fonts.ralewayMedium};
  font-size: ${fonts.medium}px;
  color: ${colors.white};
`;

export const ItemContent: React.FC<TouchableOpacityProps> = styled(
  TouchableOpacity
)`
  flex: 1;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export const LogoutText = styled(Text)`
  font-family: ${fonts.ralewayBold};
  font-size: ${fonts.regular}px;
  color: ${colors.lightRed};
`;
