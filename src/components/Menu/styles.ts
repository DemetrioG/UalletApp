import { IMenuItemProps, IMenuProps, ITextProps, Text } from "native-base";
import { TouchableOpacity, TouchableOpacityProps, View } from "react-native";
import styled from "styled-components";
import { colors, metrics } from "../../styles";
import { Avatar as NativeAvatar, Menu } from "native-base";
import React from "react";

export const NativeMenu: React.FC<IMenuProps> = styled(Menu).attrs(({theme: {theme}}) => ({
  boxSize: 'full',
  rounded: 'lg',
  minWidth: 180,
  top: metrics.baseMargin,
  right: metrics.basePadding,
  backgroundColor: theme.secondary
}))``

export const NativeMenuItem: React.FC<IMenuItemProps> = styled(Menu.Item)``

export const ItemContainer = styled(View)`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
`;

export const ItemText: React.FC<ITextProps> = styled(Text)`
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
