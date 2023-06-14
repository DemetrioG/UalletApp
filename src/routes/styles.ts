import * as React from "react";
import { Animated, View } from "react-native";
import styled from "styled-components";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { IPHONE_BOTTOM_TAB } from "../utils/device.helper";
import { colors, metrics } from "../styles";
import { Box } from "native-base";

const Tab = createBottomTabNavigator();

interface ITabListener {
  route: {
    name: string;
  };
}

export const StyledTabNavigation = styled(Tab.Navigator).attrs(
  ({ theme: { theme } }) => ({
    screenOptions: {
      headerShown: false,
      tabBarHideOnKeyboard: true,
      tabBarShowLabel: false,
      tabBarActiveTintColor: colors.lightBlue,
      tabBarStyle: {
        height: IPHONE_BOTTOM_TAB ? 80 : 60,
        backgroundColor: theme.secondary,
        position: "absolute",
        marginHorizontal: metrics.basePadding,
        borderTopWidth: 0,
        borderTopLeftRadius: metrics.baseRadius,
        borderTopRightRadius: metrics.baseRadius,
        paddingTop: IPHONE_BOTTOM_TAB ? 15 : 0,
      },
    },
  })
)``;

export const HomeIconContainer = styled(Box).attrs(() => ({
  shadow: "4",
}))`
  width: ${IPHONE_BOTTOM_TAB ? 54 : 50}px;
  height: ${IPHONE_BOTTOM_TAB ? 54 : 50}px;
  background-color: ${colors.strongBlue};
  border-radius: 50px;
  align-items: center;
  justify-content: center;
  margin-bottom: ${IPHONE_BOTTOM_TAB ? 43.5 : 37}px;
`;

export const ActiveMenuIcon: React.FC<{
  iconWidth: number;
  style: {
    opacity: Animated.Value;
    transform: any;
  };
}> = styled(Animated.View)`
  width: ${({ iconWidth }) => iconWidth - 30}px;
  height: 3px;
  background-color: ${colors.strongBlue};
  position: absolute;
  bottom: ${IPHONE_BOTTOM_TAB ? 80 : 60}px;
  left: 30px;
  border-radius: 50px;
`;

export const BackgroundContainer = styled(View)`
  padding-horizontal: ${metrics.basePadding}px;
  background-color: ${({ theme: { theme } }) => theme.primary};
`;
