import { HStack, Text } from "native-base";
import * as React from "react";
import {
  TabView as NativeTabView,
  SceneRendererProps,
  NavigationState,
} from "react-native-tab-view";
import { Touchable } from "./styles";

type TRenderScene = (
  props: SceneRendererProps & {
    route: {
      key: string;
      title: string;
    };
  }
) => React.ReactNode;

interface IRoutes {
  key: string;
  title: string;
}

const TabView = ({
  renderScene,
  tabRoutes,
}: {
  renderScene: TRenderScene;
  tabRoutes: IRoutes[];
}) => {
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState(tabRoutes);

  const TabHeader = (
    props: SceneRendererProps & { navigationState: NavigationState<IRoutes> }
  ) => {
    return (
      <HStack justifyContent="center">
        {props.navigationState.routes.map((route, i) => {
          const isActive = index === i;
          return (
            <Touchable
              key={i}
              title={route.title}
              active={isActive}
              onPress={() => setIndex(i)}
            >
              <Text>{route.title}</Text>
            </Touchable>
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
    />
  );
};

export default TabView;
