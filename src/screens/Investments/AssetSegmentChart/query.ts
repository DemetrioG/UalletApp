import firebase from "../../../services/firebase";
import { IChartData } from "../../../components/SegmentChart";
import { IData } from "../../../context/Data/dataContext";
import { currentUser } from "../../../utils/query.helper";
import { getFinalDateMonth } from "../../../utils/date.helper";

async function _getData(context: IData, defaultData: IChartData[]) {
  const user = await currentUser();
  const { month, year, modality } = context;

  if (!user) return Promise.reject();

  if (year !== 0) {
    const initialDate = new Date(`${month}/01/${year} 00:00:00`);
    const finalDate = new Date(
      `${month}/${getFinalDateMonth(month, year)}/${year} 23:59:59`
    );

    let rendaFixa = 0;
    let acoes = 0;
    let fiis = 0;
    let cripto = 0;
    let bdr = 0;

    await firebase
      .firestore()
      .collection("assets")
      .doc(user.uid)
      .collection("fixed")
      .get()
      .then((data) => {
        data.forEach((v) => {});
      });

    await firebase
      .firestore()
      .collection("assets")
      .doc(user.uid)
      .collection("variable")
      .get()
      .then((data) => {
        data.forEach((v) => {});
      });
  }
}

export function getData(context: IData, defaultData: IChartData[]) {
  try {
    return _getData(context, defaultData);
  } catch (error) {
    console.log(error);
    throw new Error("Erro ao retornar o segmento dos ativos");
  }
}
