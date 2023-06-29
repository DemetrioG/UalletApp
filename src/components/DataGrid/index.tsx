import { View } from "react-native";
import { DataGridProps } from "./types";
import { Text } from "react-native";

export const DataGrid = (props: DataGridProps) => {
  return (
    <View style={{ width: "100%", height: props.height }}>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          borderWidth: 1,
        }}
      >
        {props.columns.map((column, index) => {
          return (
            <View
              key={index}
              style={{
                flex: column.flex,
                alignItems: column.headerAlign,
                justifyContent: "center",
                minHeight: 20,
              }}
            >
              <Text>{column.label}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};
