import { View } from "react-native";
import { DataGridProps } from "./types";
import { Text } from "native-base";

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
                width: column.width,
                justifyContent: "center",
                minHeight: 20,
              }}
            >
              <Text fontSize="14px">{column.label}</Text>
            </View>
          );
        })}
      </View>
      <View style={{ display: "flex", flexDirection: "row", borderWidth: 1 }}>
        {props.columns.map((column, index) => {
          return (
            <View
              style={{
                display: "flex",
                flex: column.flex,
                width: column.width,
                alignItems: column.align,
              }}
              key={index}
            >
              {props.data.map((row, index) => {
                return (
                  <View key={index}>
                    <Text>{row[column.name]}</Text>
                  </View>
                );
              })}
            </View>
          );
        })}
      </View>
    </View>
  );
};
