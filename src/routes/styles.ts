import * as React from "react";
import { Animated, View } from "react-native";
import styled from "styled-components";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { colors, metrics } from "../styles";

const Tab = createBottomTabNavigator();

interface ITabListener {
  route: {
    name: string;
  };
}

export const StyledTabNavigation: React.FC<{
  initialRouteName: string;
  screenListeners: ({ route: { name } }: ITabListener) => void;
}> = styled(Tab.Navigator).attrs(({ theme: { theme } }) => ({
  screenOptions: {
    headerShown: false,
    tabBarHideOnKeyboard: true,
    tabBarShowLabel: false,
    tabBarStyle: {
      height: 60,
      backgroundColor: theme.secondary,
      position: "absolute",
      marginHorizontal: metrics.basePadding,
      borderTopWidth: 0,
      borderTopLeftRadius: metrics.baseRadius,
      borderTopRightRadius: metrics.baseRadius,
    },
  },
}))``;

export const HomeIconContainer = styled(View)`
  width: 50px;
  height: 50px;
  background-color: ${colors.strongBlue};
  border-radius: 50px;
  align-items: center;
  justify-content: center;
  margin-bottom: 37px;
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
  bottom: 60px;
  left: 30px;
  border-radius: 50px;
`;
