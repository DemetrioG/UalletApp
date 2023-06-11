import firebase from "@services/firebase";
import { IChartData } from "@components/SegmentChart";
import { currentUser } from "@utils/query.helper";
import { getPrice, IAsset } from "@components/Positions/query";
import { AssetSegment } from "../../../../types/types";

async function _getData(defaultData: IChartData[]) {
  const user = await currentUser();

  if (!user) return Promise.reject();

  let empty = true;
  let rendaFixa = 0;
  let acoes = 0;
  let fiis = 0;
  let fiagro = 0;
  let cripto = 0;
  let etf = 0;
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

  const assets =
    (await firebase
      .firestore()
      .collection("assets")
      .doc(user.uid)
      .collection("variable")
      .get()
      .then((data) => {
        if (!data.empty) {
          empty = false;
          const assets: IAsset[] = [];
          data.forEach(async (v) => {
            assets.push(v.data() as IAsset);
          });
          return assets;
        }
      })
      .catch((e) => Promise.reject(e))) || [];

  for (const asset of assets) {
    const { segment, asset: ticker } = asset;
    const { atualPrice } = await getPrice(ticker);
    switch (segment as AssetSegment) {
      case "Ações":
        acoes += atualPrice;
        break;
      case "FIIs":
        fiis += atualPrice;
        break;
      case "Fiagro":
        fiagro += atualPrice;
        break;
      case "Criptomoedas":
        cripto += atualPrice;
        break;
      case "ETF's":
        etf += atualPrice;
        break;
      case "BDR's":
        bdr += atualPrice;
        break;
    }
    total += atualPrice;
  }

  if (empty) {
    return Promise.reject("empty");
  }

  function returnPercentual(value: number) {
    return (value / total) * 100;
  }

  const finalData = defaultData;
  finalData[0].value = returnPercentual(rendaFixa);
  finalData[1].value = returnPercentual(acoes);
  finalData[2].value = returnPercentual(fiis);
  finalData[3].value = returnPercentual(fiagro);
  finalData[4].value = returnPercentual(cripto);
  finalData[5].value = returnPercentual(etf);
  finalData[6].value = returnPercentual(bdr);

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
