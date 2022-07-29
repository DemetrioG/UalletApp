import * as React from "react";
import { Animated, Dimensions, Keyboard } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import Icon from "../components/Icon";
import { SafeAreaContainer } from "../styles/general";
import {
  ActiveMenuIcon,
  BackgroundContainer,
  HomeIconContainer,
  StyledTabNavigation,
} from "./styles";
import { colors } from "../styles";
import Alert from "../components/Alert";
import Header from "../components/Header";
import { AppStackRoutes } from "./AppStackRoutes";

const Tab = createBottomTabNavigator();

function getWidth() {
  let width = Dimensions.get("window").width;

  // Padding Horizontal = 15...
  width = width - 30;

  // Total de Tabs
  return width / 5;
}

const AppRoutes = () => {
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
  }, []);

  // Verificação de teclado ativo para renderizar com transição o componente que fica acima do ícone na Tab
  React.useEffect(() => {
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

    () => {
      Keyboard.removeAllListeners("keyboardDidShow");
      Keyboard.removeAllListeners("keyboardDidHide");
    };
  }, []);

  function homeActive() {
    Animated.spring(tabOffsetValue, {
      toValue: getWidth() * 2,
      useNativeDriver: true,
    }).start();
  }

  function entryActive() {
    Animated.spring(tabOffsetValue, {
      toValue: getWidth(),
      useNativeDriver: true,
    }).start();
  }

  function integrateActive() {
    Animated.spring(tabOffsetValue, {
      toValue: getWidth() * 3,
      useNativeDriver: true,
    }).start();
  }

  function investActive() {
    Animated.spring(tabOffsetValue, {
      toValue: 0,
      useNativeDriver: true,
    }).start();
  }

  function reportsActive() {
    Animated.spring(tabOffsetValue, {
      toValue: getWidth() * 4,
      useNativeDriver: true,
    }).start();
  }

  return (
    <NavigationContainer>
      <SafeAreaContainer>
        <BackgroundContainer>
          <Alert />
          <Header />
        </BackgroundContainer>
        <StyledTabNavigation initialRouteName="HomeTab">
          <Tab.Screen
            name="InvestimentosTab"
            component={AppStackRoutes}
            options={{
              tabBarIcon: () => {
                return <Icon name="pie-chart" />;
              },
            }}
            listeners={({ navigation }) => ({
              tabPress: (event) => {
                event.preventDefault();
                investActive();
              },
            })}
          />
          <Tab.Screen
            name="LançamentosTab"
            component={AppStackRoutes}
            options={{
              tabBarIcon: () => {
                return <Icon name="edit-3" />;
              },
            }}
            listeners={({ navigation }) => ({
              tabPress: (event) => {
                event.preventDefault();
                entryActive();
                navigation.navigate("Lançamentos");
              },
            })}
          />
          <Tab.Screen
            name="HomeTab"
            component={AppStackRoutes}
            options={{
              tabBarIcon: () => (
                <HomeIconContainer>
                  <Icon name="home" color={colors.white} />
                </HomeIconContainer>
              ),
            }}
            listeners={({ navigation }) => ({
              tabPress: (event) => {
                event.preventDefault();
                homeActive();
                navigation.navigate("Home");
              },
            })}
          />
          <Tab.Screen
            name="IntegraçõesTab"
            component={AppStackRoutes}
            options={{
              tabBarIcon: () => {
                return <Icon name="refresh-cw" />;
              },
            }}
            listeners={({ navigation }) => ({
              tabPress: (e) => {
                e.preventDefault();
                integrateActive();
              },
            })}
          />
          <Tab.Screen
            name="RelatóriosTab"
            component={AppStackRoutes}
            options={{
              tabBarIcon: () => {
                return <Icon name="list" />;
              },
            }}
            listeners={({ navigation }) => ({
              tabPress: (e) => {
                e.preventDefault();
                reportsActive();
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
};

export default AppRoutes;
