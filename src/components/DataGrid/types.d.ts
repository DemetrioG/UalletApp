import { StyleProp, ViewStyle } from "react-native";

export interface DataGridColumnRef {
  label: string;
  name: string;
  flex?: 1 | 0;
  headerAlign?: "flex-start" | "center" | "flex-end";
  align?: "flex-start" | "center" | "flex-end";
  width?: number;
}

export interface DataGridProps {
  columns: DataGridColumnRef[];
  data: Array<T>;
  height?: number | string;
  HeaderProps?: {
    styles?: StyleProp<ViewStyle>;
  };
  RowProps?: {
    styles?: StyleProp<ViewStyle>;
  };
}
