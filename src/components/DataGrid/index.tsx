import { View } from "react-native";
import { DataGridProps } from "./types";
import { Text } from "native-base";
import { FlatList } from "react-native";
import When from "../When";

export const DataGrid = (props: DataGridProps) => {
  return (
    <View
      style={{
        width: "100%",
        height: props.height,
        alignItems: !props.data.length ? "center" : undefined,
        justifyContent: !props.data.length ? "center" : undefined,
      }}
    >
      <When is={!props.data.length}>
        <Text>Não há dados para visualizar</Text>
      </When>
      <When is={!!props.data.length}>
        <>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
            }}
          >
            {props.columns.map((column, index) => {
              return (
                <View
                  key={index}
                  style={{
                    padding: 3,
                    flex: column.flex,
                    alignItems: column.headerAlign,
                    width: column.width,
                    justifyContent: "center",
                    minHeight: 20,
                    ...(column.HeaderProps?.styles as object),
                  }}
                >
                  <Text fontSize="14px" fontWeight={500}>
                    {column.label}
                  </Text>
                </View>
              );
            })}
          </View>
          <View style={{ display: "flex" }}>
            <FlatList
              data={props.data}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item: row }) => (
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                  }}
                >
                  {props.columns.map((column, index) => (
                    <View
                      key={index}
                      style={{
                        padding: 8,
                        flex: column.flex,
                        width: column.width,
                        alignItems: column.align,
                        borderBottomWidth: 1,
                        ...(column.RowProps?.styles as object),
                      }}
                    >
                      <Text numberOfLines={1}>
                        {column.valueFormatter
                          ? column.valueFormatter({
                              row: row,
                              value: row[column.name],
                            })
                          : row[column.name]}
                      </Text>
                    </View>
                  ))}
                </View>
              )}
            />
          </View>
        </>
      </When>
    </View>
  );
};
