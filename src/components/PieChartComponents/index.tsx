import { View } from "react-native";
import { ForeignObject } from "react-native-svg";
import { PieChartLabel } from "../../screens/Home/styles";

interface ISlices {
  slices?: [
    slice: {
      pieCentroid: number[];
      data: {
        key: number;
        svg: object;
      };
      value: number;
    }
  ];
  data: number[];
}

// Criação de labels para o Pie Chart
export const Label = ({ slices, data }: ISlices) => {
  return (
    <>
      {slices?.map((slice, index) => {
        const { pieCentroid, value } = slice;
        return value !== 0 ? (
          <ForeignObject
            key={index}
            // Se o valor do chart for menor que 6, ele joga o label um pouco para a direita para não ficar desalinhado
            x={data[index] < 6 ? pieCentroid[0] - 9 : pieCentroid[0] - 12}
            y={pieCentroid[1] - 8}
            width={100}
            height={100}
          >
            <View>
              <PieChartLabel>{value}%</PieChartLabel>
            </View>
          </ForeignObject>
        ) : null;
      })}
    </>
  );
};
