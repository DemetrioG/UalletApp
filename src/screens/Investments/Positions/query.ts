import firebase from "../../../services/firebase";
import axios, { ACOES_URL, FII_URL } from "../../../utils/api.helper";
import {
  getRent,
  getRentPercentual,
  realToNumber,
} from "../../../utils/number.helper";

export interface IAsset {
  id: number;
  asset: string;
  price: number;
  amount: number;
  segment: string;
  atualPrice: number;
  rentPercentual: string;
  rent: number;
  total?: number;
  dy?: string;
  pvp?: string;
  pl?: string;
}

interface IInfos {
  asset: string;
  atualPrice: number;
  rent: number;
  rentPercentual: string;
  dy: string;
  pvp: string;
  pl: string;
  totalPrecoAtual: number;
  totalPrecoMedio: number;
  totalPrecoInicial: number;
}

async function _getAssets(uid: string) {
  const data: IAsset[] = [];
  await firebase
    .firestore()
    .collection("assets")
    .doc(uid)
    .collection("variable")
    .orderBy("segment")
    .get()
    .then((v) => {
      v.forEach((result) => {
        const asset = {
          id: result.data().id,
          asset: result.data().asset,
          price: result.data().price,
          amount: result.data().amount,
          segment: result.data().segment,
          atualPrice: result.data().price,
          total: result.data().total,
          rentPercentual: "0,00%",
          rent: 0,
        };
        data.push(asset);
      });
    })
    .catch(() => {
      throw new Error();
    });

  return data;
}

export function getAssets(uid: string) {
  try {
    return _getAssets(uid);
  } catch (error) {
    throw new Error("Erro");
  }
}

async function _getUpdatedInfos(data: IAsset[]) {
  const assetsInfo: IInfos[] = [];

  for (const item of data) {
    let URL = ACOES_URL + item.asset;

    if (item.segment === "FIIs e Fiagro") {
      URL = FII_URL + item.asset;
    }

    await axios.get(URL).then(({ data }) => {
      const infos: IInfos = {
        asset: data.TICKER,
        atualPrice: data.PRECO,
        rent: Number(
          (getRent(item.price, realToNumber(data.PRECO)) * item.amount).toFixed(
            2
          )
        ),
        rentPercentual:
          getRentPercentual(item.price, realToNumber(data.PRECO)) + "%",
        dy: data.DY + "%",
        pvp: data.P_VP,
        pl: data.P_L,
        totalPrecoAtual: realToNumber(data.PRECO) * item.amount,
        totalPrecoMedio: item.total || 0,
        totalPrecoInicial: realToNumber(data.PRECO_ABERTURA) * item.amount,
      };

      return assetsInfo.push(infos);
    });
  }

  return assetsInfo;
}

export function getUpdatedInfos(data: IAsset[]) {
  try {
    return _getUpdatedInfos(data);
  } catch (error) {
    throw new Error("Erro");
  }
}
