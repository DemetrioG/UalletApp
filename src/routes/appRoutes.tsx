import * as React from "react";
import { Animated, Dimensions, Keyboard } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import StackHome from "../screens/StackHome";
import StackEntry from "../screens/StackEntry";
import { Icon, SafeAreaContainer } from "../styles/general";
import {
  ActiveMenuIcon,
  BackgroundContainer,
  HomeIconContainer,
  StyledTabNavigation,
} from "./styles";
import { colors } from "../styles";
import Alert from "../components/Alert";
import Header from "../components/Header";

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
      }
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

  function showActive(name: string) {
    switch (name) {
      case "InvestimentosTab":
        investActive();
        break;

      case "LançamentosTab":
        entryActive();
        break;

      case "HomeTab":
        homeActive();
        break;

      case "IntegraçõesTab":
        integrateActive();
        break;

      case "RelatóriosTab":
        reportsActive();
        break;

      default:
        homeActive();
        break;
    }
  }

  return (
    <NavigationContainer>
      <SafeAreaContainer>
        <BackgroundContainer>
          <Alert />
          <Header />
        </BackgroundContainer>
        <StyledTabNavigation
          initialRouteName="HomeTab"
          screenListeners={({ route: { name } }) => showActive(name)}
        >
          <Tab.Screen
            name="InvestimentosTab"
            component={StackHome}
            options={{
              tabBarIcon: ({ focused }) => {
                return <Icon name="pie-chart" />;
              },
            }}
            listeners={{
              tabPress: (e) => e.preventDefault(),
            }}
          />
          <Tab.Screen
            name="LançamentosTab"
            component={StackEntry}
            options={{
              tabBarIcon: () => {
                return <Icon name="edit-3" />;
              },
            }}
          />
          <Tab.Screen
            name="HomeTab"
            component={StackHome}
            options={{
              tabBarIcon: () => (
                <HomeIconContainer>
                  <Icon name="home" color={colors.white} />
                </HomeIconContainer>
              ),
            }}
          />
          <Tab.Screen
            name="IntegraçõesTab"
            component={StackHome}
            options={{
              tabBarIcon: () => {
                return <Icon name="refresh-cw" />;
              },
            }}
            listeners={{
              tabPress: (e) => e.preventDefault(),
            }}
          />
          <Tab.Screen
            name="RelatóriosTab"
            component={StackHome}
            options={{
              tabBarIcon: () => {
                return <Icon name="list" />;
              },
            }}
            listeners={{
              tabPress: (e) => e.preventDefault(),
            }}
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
