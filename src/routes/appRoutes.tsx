import * as React from "react";
import { Animated, Dimensions, Keyboard } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import StackHome from "../pages/StackHome";
import StackEntry from "../pages/StackEntry";
import { SafeAreaContainer, StyledIcon } from "../styles/general";
import {
  ActiveMenuIcon,
  HomeIconContainer,
  StyledTabNavigation,
} from "./styles";
import { colors } from "../styles";

const Tab = createBottomTabNavigator();

function getWidth() {
  let width = Dimensions.get("window").width;

  // Padding Horizontal = 15...
  width = width - 30;

  // Total de Tabs
  return width / 5;
}

export default function AppRoutes() {
  const [keyboardVisible, setKeyboardVisible] = React.useState(false);

  const opacity = React.useRef(new Animated.Value(0)).current;
  const tabOffsetValue = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.spring(tabOffsetValue, {
      toValue: getWidth() * 2,
      useNativeDriver: true,
    }).start();

    Animated.timing(opacity, {
      toValue: 1,
      duration: 1800,
      useNativeDriver: true,
    }).start();

    // Verificação de teclado ativo para renderizar com transição o componente que fica acima do ícone na Tab
    Keyboard.addListener("keyboardDidShow", () => {
      setKeyboardVisible(true);

      Animated.timing(opacity, {
        toValue: 0,
        duration: 50,
        useNativeDriver: true,
      }).start();
    });

    Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardVisible(false);

      Animated.timing(opacity, {
        toValue: 1,
        duration: 1800,
        useNativeDriver: true,
      }).start();
    });
  });

  return (
    <NavigationContainer>
      <SafeAreaContainer>
        <StyledTabNavigation initialRouteName="HomeTab">
          <Tab.Screen
            name="InvestimentosTab"
            component={StackHome}
            options={{
              tabBarIcon: ({ focused }) => {
                return <StyledIcon name="pie-chart" />;
              },
            }}
            listeners={({ navigation, route }) => ({
              tabPress: (e) => {
                Animated.spring(tabOffsetValue, {
                  toValue: 0,
                  useNativeDriver: true,
                }).start();
              },
            })}
          />
          <Tab.Screen
            name="LançamentosTab"
            component={StackEntry}
            options={{
              tabBarIcon: () => {
                return <StyledIcon name="edit-3" />;
              },
            }}
            listeners={({ navigation, route }) => ({
              tabPress: (e) => {
                Animated.spring(tabOffsetValue, {
                  toValue: getWidth(),
                  useNativeDriver: true,
                }).start();
              },
            })}
          />
          <Tab.Screen
            name="HomeTab"
            component={StackHome}
            options={{
              tabBarIcon: () => (
                <HomeIconContainer>
                  <StyledIcon name="home" color={colors.white} />
                </HomeIconContainer>
              ),
            }}
            listeners={({ navigation, route }) => ({
              tabPress: (e) => {
                Animated.spring(tabOffsetValue, {
                  toValue: getWidth() * 2,
                  useNativeDriver: true,
                }).start();
              },
            })}
          />
          <Tab.Screen
            name="IntegraçõesTab"
            component={StackHome}
            options={{
              tabBarIcon: () => {
                return <StyledIcon name="refresh-cw" />;
              },
            }}
            listeners={({ navigation, route }) => ({
              tabPress: (e) => {
                Animated.spring(tabOffsetValue, {
                  toValue: getWidth() * 3,
                  useNativeDriver: true,
                }).start();
              },
            })}
          />
          <Tab.Screen
            name="RelatóriosTab"
            component={StackHome}
            options={{
              tabBarIcon: () => {
                return <StyledIcon name="list" />;
              },
            }}
            listeners={({ navigation, route }) => ({
              tabPress: (e) => {
                Animated.spring(tabOffsetValue, {
                  toValue: getWidth() * 4,
                  useNativeDriver: true,
                }).start();
              },
            })}
          />
        </StyledTabNavigation>
        {!keyboardVisible && (
          <ActiveMenuIcon
            iconWidth={getWidth()}
            style={{
              opacity,
              transform: [{ translateX: tabOffsetValue }],
            }}
          />
        )}
      </SafeAreaContainer>
    </NavigationContainer>
  );
}
