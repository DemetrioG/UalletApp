import { StyleProp, ViewStyle } from "react-native";

export interface DataGridColumnRef<T> {
  label: string;
  name: string;
  flex?: 1 | 0;
  headerAlign?: "flex-start" | "center" | "flex-end";
  align?: "flex-start" | "center" | "flex-end";
  width?: number;
  valueFormatter?: ({
    row,
    value,
  }: {
    row: T;
    value: any;
  }) => string | number | null;
  HeaderProps?: {
    styles?: StyleProp<ViewStyle>;
  };
  RowProps?: {
    styles?: StyleProp<ViewStyle>;
  };
}

export interface DataGridProps {
  columns: DataGridColumnRef<T>[];
  data: Array<T>;
  height?: number | string;
}
