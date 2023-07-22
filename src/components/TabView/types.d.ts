import { SceneRendererProps } from "react-native-tab-view";

export interface RouteProps {
  key: string;
  title: string;
  selected?: boolean;
  isEditing: boolean;
}

export interface TabViewProps {
  renderScene: (
    props: SceneRendererProps & {
      route: RouteProps;
    },
    activeTab: RouteProps
  ) => React.ReactNode;
  tabRoutes: RouteProps[];
}
