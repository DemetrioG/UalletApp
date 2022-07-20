import { Text } from "native-base";
import { TouchableOpacity, TouchableOpacityProps, View } from "react-native";
import styled from "styled-components";
import { colors } from "../../styles";
import { Avatar as NativeAvatar } from "native-base";

export const ItemContainer = styled(View)`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
  border-bottom-width: 1px;
  border-color: ${colors.transpDark};
`;

export const ItemText = styled(Text)`
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
  color: ${colors.lightRed};
`;

export const Avatar = styled(NativeAvatar).attrs(() => ({
  size: "sm",
  fontFamily: "body",
  shadow: "2",
}))``;

export const AvatarText = styled(Text).attrs(() => ({
  fontSize: "sm",
  fontWeight: 700,
}))``;
