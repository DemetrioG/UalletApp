import { HStack, ITextProps, Text } from "native-base";
import { TouchableOpacity, TouchableOpacityProps, View } from "react-native";
import styled from "styled-components";
import { colors, metrics } from "../../styles";
import { Avatar as NativeAvatar } from "native-base";
import React from "react";


export const ItemContainer = styled(HStack)`
  border-bottom-width: 1px;
  border-bottom-color: ${({theme: {theme}}) => theme.primary};
  align-items: center;
  justify-content: space-between;
  padding: 20px;
`;

export const ItemText: React.FC<ITextProps & { logout?: boolean}> = styled(Text).attrs(() => ({
  fontSize: 'md'
}))`
  color: ${({logout, theme: {theme}}) => !logout ? theme.text : theme.red};
`;

export const ItemContent: React.FC<TouchableOpacityProps> = styled(
  TouchableOpacity
)`
  flex: 1;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
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

export const AvatarMenu = styled(NativeAvatar).attrs(() => ({
  size: 90,
  backgroundColor: colors.strongBlue
}))``

export const AvatarMenuText = styled(Text).attrs(() => ({
  fontSize: 36,
  fontWeight: 700,
  color: colors.white
}))``

export const Container = styled(View)`
  height: 90%;
  width: 100%;
  position: absolute;
  bottom: -20px;
  border-top-left-radius: ${metrics.baseRadius * 2}px;
  border-top-right-radius: ${metrics.baseRadius * 2}px;
  background-color: ${colors.lightBlue};
`

export const MenuContainer = styled(Container)`
  height: 65%;
  background-color: ${({theme: {theme}}) => theme.secondary};
  padding: ${metrics.basePadding * 2}px;
`

export const ProfileContainer = styled(View)`
  align-items: center;
  margin-top: 30px;
`

export const Circle = styled(View)`
  width: 80px;
  height: 80px;
  border-radius: 50px;
  background-color: ${colors.strongBlue};
`

export const CircleText = styled(Text).attrs(() => ({
  fontSize: '3xl'
}))`
  color: ${colors.white};
`

export const Name = styled(Text).attrs(() => ({
  fontWeight: 700,
  fontSize: 'md'
}))`
  padding-top: 15px;
  text-align: center;
  color: ${colors.white};
`

export const Email = styled(Text).attrs(() => ({
  fontSize: 'sm'
}))`
  padding-top: 5px;
  text-align: center;
  color: ${colors.white};
`
