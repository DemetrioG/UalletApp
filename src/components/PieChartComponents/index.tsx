import { View } from "react-native";
import { ForeignObject } from "react-native-svg";
import { PieChartLabel } from "../../pages/Home/styles";
import { colors } from "../../styles";

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

export const colorPieChartLight = [
  colors.darkPrimary,
  colors.strongPurple,
  colors.lightPurple,
  colors.strongRed,
  colors.lightRed,
];
export const colorPieChartDark = [
  colors.darkPrimary,
  colors.strongRed,
  colors.lightRed,
  colors.lightBlue,
  colors.whiteBlue,
];

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
