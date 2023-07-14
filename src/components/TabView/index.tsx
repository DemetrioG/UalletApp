import { HStack, Pressable, Text } from "native-base";
import { useEffect, useState } from "react";
import {
  TabView as NativeTabView,
  SceneRendererProps,
  NavigationState,
} from "react-native-tab-view";
import { IThemeProvider } from "../../styles/baseTheme";
import { useTheme } from "styled-components";
import { RouteProps, TabViewProps } from "./types";

export const TabView = ({ renderScene, tabRoutes }: TabViewProps) => {
  const { theme }: IThemeProvider = useTheme();
  const [index, setIndex] = useState(0);
  const [routes] = useState(tabRoutes);
  const [hasSelectedRoute, setHasSelectedRoute] = useState(false);

  useEffect(() => {
    const selectedRoute = tabRoutes.findIndex((e) => e.selected);
    if (selectedRoute !== -1) {
      setIndex(selectedRoute);
      setHasSelectedRoute(true);
    }
  }, []);

  const TabHeader = (
    props: SceneRendererProps & { navigationState: NavigationState<RouteProps> }
  ) => {
    return (
      <HStack justifyContent="center">
        {props.navigationState.routes.map((route, i) => {
          const isActive = index === i;
          return (
            <Pressable
              key={i}
              paddingX={10}
              paddingY={3}
              borderBottomWidth={isActive ? 2 : 0}
              borderBottomColor={theme?.blue}
              onPress={() => !hasSelectedRoute && setIndex(i)}
            >
              <Text>{route.title}</Text>
            </Pressable>
          );
        })}
      </HStack>
    );
  };

  return (
    <NativeTabView
      navigationState={{ index, routes }}
      renderScene={(props) => renderScene(props, routes[index])}
      onIndexChange={setIndex}
      renderTabBar={TabHeader}
      swipeEnabled={!hasSelectedRoute}
    />
  );
};
