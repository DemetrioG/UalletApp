import { HStack, Pressable, Text } from "native-base";
import * as React from "react";
import {
  TabView as NativeTabView,
  SceneRendererProps,
  NavigationState,
} from "react-native-tab-view";
import { Touchable } from "./styles";
import { TouchableOpacity } from "react-native";
import { IThemeProvider } from "../../styles/baseTheme";
import { useTheme } from "styled-components";

type TRenderScene = (
  props: SceneRendererProps & {
    route: {
      key: string;
      title: string;
    };
  }
) => React.ReactNode;

export interface IRoutes {
  key: string;
  title: string;
  selected?: boolean;
}

const TabView = ({
  renderScene,
  tabRoutes,
}: {
  renderScene: TRenderScene;
  tabRoutes: IRoutes[];
}) => {
  const { theme }: IThemeProvider = useTheme();
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState(tabRoutes);
  const [hasSelectedRoute, setHasSelectedRoute] = React.useState(false);

  React.useEffect(() => {
    const selectedRoute = tabRoutes.findIndex((e) => e.selected);
    if (selectedRoute !== -1) {
      setIndex(selectedRoute);
      setHasSelectedRoute(true);
    }
  }, []);

  const TabHeader = (
    props: SceneRendererProps & { navigationState: NavigationState<IRoutes> }
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
      renderScene={renderScene}
      onIndexChange={setIndex}
      renderTabBar={TabHeader}
      swipeEnabled={!hasSelectedRoute}
    />
  );
};

export default TabView;
