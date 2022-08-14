import * as React from "react";
import { View } from "native-base";

import firebase from "../../services/firebase";
import EmptyChart from "../EmptyChart";
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
  PieCenter,
} from "./styles";
import { metrics } from "../../styles";

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
        return (
          <View key={index}>
            {value !== 0 && (
              <PieChartLabel
                x={pieCentroid[0] + (metrics.screenWidth / 100) * 17.5}
                y={pieCentroid[1] + 57}
              >
                {Math.round(value)}%
              </PieChartLabel>
            )}
          </View>
        );
      })}
    </>
  );
};

const SegmentChart = () => {
  const { data: dataContext } = React.useContext(DataContext);
  const { user } = React.useContext(UserContext);
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
      if (dataContext.year !== 0) {
        const initialDate = new Date(
          `${dataContext.month}/01/${dataContext.year} 00:00:00`
        );
        const finalDate = new Date(
          `${dataContext.month}/${getFinalDateMonth(
            dataContext.month,
            dataContext.year
          )}/${dataContext.year} 23:59:59`
        );

        // Busca no banco os dados referente ao Mês atual
        await firebase
          .firestore()
          .collection("entry")
          .doc(user.uid)
          .collection(dataContext.modality)
          .get()
          .then((result) => {
            if (!result.empty) {
              setEmpty(false);
              firebase
                .firestore()
                .collection("entry")
                .doc(user.uid)
                .collection(dataContext.modality)
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
  }, [dataContext]);

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
                  <PieCenter />
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
};

export default SegmentChart;
