import * as React from "react";
import { Animated, Dimensions, Keyboard } from "react-native";
import {
  NavigationContainer,
  useNavigationContainerRef,
} from "@react-navigation/native";
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
import ConfirmDialog from "../components/ConfirmDialog";
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

  const navigationRef = useNavigationContainerRef();
  const routeNameRef: React.MutableRefObject<undefined | string> =
    React.useRef();

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
    const keyboardShow = Keyboard.addListener("keyboardDidShow", () => {
      setKeyboardVisible(true);
      Animated.timing(opacity, {
        toValue: 0,
        duration: 50,
        useNativeDriver: true,
      }).start();
    });

    const keyboardHide = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardVisible(false);
      Animated.timing(opacity, {
        toValue: 1,
        duration: 1800,
        useNativeDriver: true,
      }).start();
    });

    () => {
      keyboardShow.remove();
      keyboardHide.remove();
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

  function changeIndicator(routeNameRef: string) {
    routeNameRef.includes("Home") && homeActive();
    routeNameRef.includes("Investimentos") && investActive();
    routeNameRef.includes("Lancamentos") && entryActive();
    routeNameRef.includes("Integracoes") && integrateActive();
    routeNameRef.includes("Relatorios") && reportsActive();
  }

  return (
    <NavigationContainer
      ref={navigationRef}
      onReady={() => {
        routeNameRef.current = navigationRef.getCurrentRoute()?.name;
      }}
      onStateChange={() => {
        const currentRoute = navigationRef.getCurrentRoute()?.name;
        changeIndicator(currentRoute || "");
      }}
    >
      <SafeAreaContainer>
        <BackgroundContainer>
          <ConfirmDialog />
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
                navigation.navigate("Investimentos");
              },
            })}
          />
          <Tab.Screen
            name="LancamentosTab"
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
                navigation.navigate("Lancamentos");
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
            name="IntegracoesTab"
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
            name="RelatoriosTab"
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
