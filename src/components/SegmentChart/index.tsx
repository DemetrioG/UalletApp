import * as React from "react";
import { ForeignObject } from "react-native-svg";

import firebase from "../../services/firebase";
import EmptyChart from "../EmptyChart";
import { DateContext } from "../../context/Date/dateContext";
import { UserContext } from "../../context/User/userContext";
import { LoaderContext } from "../../context/Loader/loaderContext";
import { DataContext } from "../../context/Data/dataContext";
import { getFinalDateMonth } from "../../utils/date.helper";
import {
  StyledPieChart,
  PieChartLabel,
  SegmentChartView,
  SegmentLabelView,
  ContentLabel,
  DotView,
  SegmentLabelText,
  ChartContainer,
} from "./styles";
import { StyledLoader } from "../../styles/general";

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
            <PieChartLabel>{Math.round(value)}%</PieChartLabel>
          </ForeignObject>
        ) : null;
      })}
    </>
  );
};

export default function SegmentChart() {
  const { date } = React.useContext(DateContext);
  const { user } = React.useContext(UserContext);
  const { data: userData } = React.useContext(DataContext);
  const { loader, setLoader } = React.useContext(LoaderContext);
  /**
   * INDEX
   * 0: Leisure
   * 1: Invest
   * 2: Education
   * 3: Short and Medium Time
   * 4: Needs
   */
  const [data, setData] = React.useState([0, 0, 0, 0, 0]);
  const [empty, setEmpty] = React.useState(false);

  React.useEffect(() => {
    (async function getData() {
      if (date.year !== 0) {
        const initialDate = new Date(`${date.month}/01/${date.year} 00:00:00`);
        const finalDate = new Date(
          `${date.month}/${getFinalDateMonth(date.month, date.year)}/${
            date.year
          } 23:59:59`
        );

        // Busca no banco os dados referente ao Mês atual
        await firebase
          .firestore()
          .collection("entry")
          .doc(user.uid)
          .collection(date.modality)
          .get()
          .then((result) => {
            if (!result.empty) {
              setEmpty(false);
              firebase
                .firestore()
                .collection("entry")
                .doc(user.uid)
                .collection(date.modality)
                .where("type", "==", "Despesa")
                .where("date", ">=", initialDate)
                .where("date", "<=", finalDate)
                .onSnapshot((snapshot) => {
                  let needs = 0;
                  let invest = 0;
                  let leisure = 0;
                  let education = 0;
                  let shortAndMediumTime = 0;
                  let total = 0;
                  if (snapshot.docs.length > 0) {
                    snapshot.forEach((result) => {
                      const segmentData = [result.data()];
                      segmentData.forEach(({ segment }, index) => {
                        switch (segment) {
                          case "Necessidades":
                            needs++;
                            break;

                          case "Investimentos":
                            invest++;
                            break;

                          case "Lazer":
                            leisure++;
                            break;

                          case "Educação":
                            education++;
                            break;

                          case "Curto e médio prazo":
                            shortAndMediumTime++;
                            break;
                        }

                        total++;
                      });
                    });
                  } else {
                    setEmpty(true);
                  }

                  needs = (needs / total) * 100;
                  invest = (invest / total) * 100;
                  leisure = (leisure / total) * 100;
                  education = (education / total) * 100;
                  shortAndMediumTime = (shortAndMediumTime / total) * 100;

                  setData([
                    leisure,
                    invest,
                    education,
                    shortAndMediumTime,
                    needs,
                  ]);
                });
            } else {
              setEmpty(true);
            }
          });
        setLoader((loaderState) => ({
          ...loaderState,
          segmentChart: true,
        }));
      }
    })();
  }, [date, userData.balance]);

  return (
    <>
      {!loader.visible && (
        <ChartContainer>
          {empty ? (
            <EmptyChart
              emphasisText="Parece que você não cadastrou nenhuma despesa para o período"
              iconName="pie-chart"
              helperText="Realize seu primeiro lançamento!"
            />
          ) : (
            <>
              <SegmentChartView>
                <StyledPieChart data={data}>
                  <Label data={data} />
                </StyledPieChart>
              </SegmentChartView>
              <SegmentLabelView>
                <ContentLabel>
                  <DotView index={0} />
                  <SegmentLabelText>Lazer</SegmentLabelText>
                </ContentLabel>
                <ContentLabel>
                  <DotView index={2} />
                  <SegmentLabelText>Educação</SegmentLabelText>
                </ContentLabel>
                <ContentLabel>
                  <DotView index={1} />
                  <SegmentLabelText>Investimentos</SegmentLabelText>
                </ContentLabel>
                <ContentLabel>
                  <DotView index={4} />
                  <SegmentLabelText>Necessidades</SegmentLabelText>
                </ContentLabel>
                <ContentLabel>
                  <DotView index={3} />
                  <SegmentLabelText>Curto e médio prazo</SegmentLabelText>
                </ContentLabel>
              </SegmentLabelView>
            </>
          )}
        </ChartContainer>
      )}
    </>
  );
}
