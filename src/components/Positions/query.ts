import firebase from "../../services/firebase";
import axios, { ACOES_URL, FII_URL } from "../../utils/api.helper";
import { getAtualDate } from "../../utils/date.helper";
import {
  getRent,
  getRentPercentual,
  realToNumber,
} from "../../utils/number.helper";
import { currentUser } from "../../utils/query.helper";

export interface IAsset {
  id: number;
  asset: string;
  price: number;
  amount: number;
  segment: string;
  atualPrice: number;
  rentPercentual: number;
  rent: number;
  total: number;
  totalAtual: number;
  dy: number;
  pvp: number;
  pl: number;
}

interface IInfos {
  id: number;
  asset: string;
  atualPrice: number;
  rent: number;
  rentPercentual: number;
  dy: number;
  pvp: number;
  pl: number;
  totalPrecoAtual: number;
  totalPrecoMedio: number;
  totalPrecoInicial: number;
}

export interface ITotal {
  date: firebase.firestore.Timestamp;
  equity: number;
  todayRent: number;
  todayValue: number;
  totalRent: number;
  totalValue: number;
}

async function _getAssets() {
  const user = await currentUser();

  if (!user) return Promise.reject();

  const assetsData: IAsset[] | firebase.firestore.DocumentData = [];
  await firebase
    .firestore()
    .collection("assets")
    .doc(user.uid)
    .collection("variable")
    .orderBy("segment")
    .get()
    .then((v) => {
      v.forEach((result) => {
        assetsData.push(result.data());
      });
    })
    .catch(() => Promise.reject());

  let totalData: firebase.firestore.DocumentData | undefined = {};
  await firebase
    .firestore()
    .collection("equity")
    .doc(user.uid)
    .get()
    .then((v) => {
      totalData = v.data();
    })
    .catch(() => Promise.reject());

  return {
    assets: assetsData as IAsset[],
    total: totalData as ITotal,
  };
}

async function _getUpdatedInfos(data: IAsset[]) {
  const assetsInfo: IInfos[] = [];

  for (const item of data) {
    let URL = ACOES_URL + item.asset;

    if (item.segment === "FIIs e Fiagro") {
      URL = FII_URL + item.asset;
    }

    await axios.get(URL).then(({ data }) => {
      const defaultReal = "R$0,00";
      const infos: IInfos = {
        id: item.id,
        asset: data.TICKER,
        atualPrice: realToNumber(data.PRECO || defaultReal),
        rent: Number(
          (
            getRent(item.price, realToNumber(data.PRECO || defaultReal)) *
            item.amount
          ).toFixed(2)
        ),
        rentPercentual: realToNumber(
          getRentPercentual(
            item.price,
            realToNumber(data.PRECO || defaultReal)
          ) || defaultReal
        ),
        dy: realToNumber(data.DY || defaultReal),
        pvp: realToNumber(data.P_VP || defaultReal),
        pl: realToNumber(data.P_L || defaultReal),
        totalPrecoAtual: realToNumber(data.PRECO || defaultReal) * item.amount,
        totalPrecoMedio: item.total || 0,
        totalPrecoInicial:
          realToNumber(data.PRECO_ABERTURA || defaultReal) * item.amount,
      };

      return assetsInfo.push(infos);
    });
  }

  return assetsInfo;
}

async function _refreshAssetData() {
  const user = await currentUser();

  if (!user) return Promise.reject();

  await getAssets()
    .then(async ({ assets }) => {
      let totalValue = 0;
      let totalInitialPrice = 0;
      let totalMediumPrice = 0;
      let totalAtualPrice = 0;

      if (assets.length > 0) {
        await getUpdatedInfos(assets as IAsset[]).then(async (infos) => {
          for (const info of infos) {
            const newData = {
              id: info.id,
              totalAtual: Number(info.totalPrecoAtual.toFixed(2)),
              atualPrice: Number(info.atualPrice.toFixed(2)),
              rent: Number(info.rent.toFixed(2)),
              rentPercentual: Number(info.rentPercentual.toFixed(2)),
              pvp: info.pvp,
              dy: info.dy,
              pl: info.pl,
            };

            await firebase
              .firestore()
              .collection("assets")
              .doc(user.uid)
              .collection("variable")
              .doc(info.id.toString())
              .set(newData, { merge: true });

            totalValue += info.rent;
            totalAtualPrice += info.totalPrecoAtual;
            totalMediumPrice += info.totalPrecoMedio;
            totalInitialPrice += info.totalPrecoInicial;
          }
        });
      }

      const [, currentDateInitial, , currentDate] = getAtualDate();
      const dateRef = currentDate as string;
      const equityData = {
        date: currentDateInitial,
        totalValue: Number(totalValue.toFixed(2)),
        totalRent: Number(
          realToNumber(
            getRentPercentual(totalMediumPrice, totalAtualPrice)
          ).toFixed(2)
        ),
        todayValue: Number((totalAtualPrice - totalInitialPrice).toFixed(2)),
        todayRent: Number(
          realToNumber(
            getRentPercentual(totalInitialPrice, totalAtualPrice)
          ).toFixed(2)
        ),
      };

      await firebase
        .firestore()
        .collection("equity")
        .doc(user.uid)
        .collection("variable")
        .doc(dateRef.replace(/[/]/g, "_"))
        .set(equityData);

      await firebase
        .firestore()
        .collection("equity")
        .doc(user.uid)
        .set(
          {
            equity: Number(totalAtualPrice.toFixed(2)),
            ...equityData,
          },
          { merge: true }
        );
    })
    .catch(() => {
      return Promise.reject();
    });
}

export function getAssets() {
  try {
    return _getAssets();
  } catch (error) {
    throw new Error("Erro");
  }
}

function getUpdatedInfos(data: IAsset[]) {
  try {
    return _getUpdatedInfos(data);
  } catch (error) {
    throw new Error("Erro");
  }
}

export function refreshAssetData() {
  try {
    return _refreshAssetData();
  } catch (error) {
    throw new Error("Erro ao atualizar as posições");
  }
}
