import firebase from "../../../services/firebase";
import { IChartData } from "../../../components/SegmentChart";
import { currentUser } from "../../../utils/query.helper";
import { IAsset } from "../../../components/Positions/query";

async function _getData(defaultData: IChartData[]) {
  const user = await currentUser();

  if (!user) return Promise.reject();

  let empty = true;
  let rendaFixa = 0;
  let acoes = 0;
  let fiis = 0;
  let cripto = 0;
  let bdr = 0;
  let total = 0;

  await firebase
    .firestore()
    .collection("assets")
    .doc(user.uid)
    .collection("fixed")
    .get()
    .then((data) => {
      if (!data.empty) {
        empty = false;
        data.forEach((v) => {
          const value = v.data()?.price || 0;
          rendaFixa += value;
          total += value;
        });
      }
    })
    .catch((e) => Promise.reject(e));

  await firebase
    .firestore()
    .collection("assets")
    .doc(user.uid)
    .collection("variable")
    .get()
    .then((data) => {
      if (!data.empty) {
        empty = false;
        data.forEach((v) => {
          const data = v.data() as IAsset;
          switch (data.segment) {
            case "Ações":
              acoes += data.atualPrice;
              break;
            case "FIIs e Fiagro":
              fiis += data.atualPrice;
              break;
            case "Criptomoedas":
              cripto += data.atualPrice;
              break;
            case "BDR's":
              bdr += data.atualPrice;
              break;
          }
          total += data.atualPrice;
        });
      }
    })
    .catch((e) => Promise.reject(e));

  if (empty) {
    return Promise.reject("empty");
  }

  rendaFixa = (rendaFixa / total) * 100;
  acoes = (acoes / total) * 100;
  fiis = (fiis / total) * 100;
  cripto = (cripto / total) * 100;
  bdr = (bdr / total) * 100;

  const finalData = defaultData;
  finalData[0].value = rendaFixa;
  finalData[1].value = acoes;
  finalData[2].value = fiis;
  finalData[3].value = cripto;
  finalData[4].value = bdr;

  return Promise.resolve(finalData);
}

export function getData(defaultData: IChartData[]) {
  try {
    return _getData(defaultData);
  } catch (error) {
    console.log(error);
    throw new Error("Erro ao retornar o segmento dos ativos");
  }
}
