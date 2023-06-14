import firebase from "../../services/firebase";
import { IVariableIncome } from "../../types/assets";
import { AssetSegment } from "../../types/types";
import { getAtualDate } from "../../utils/date.helper";
import {
  getRent,
  getRentPercentual,
  realToNumber,
} from "../../utils/number.helper";
import { currentUser } from "../../utils/query.helper";
interface IPrices {
  atualPrice: number;
  dy: number;
  lastRefresh: string;
  openPrice: number;
  pvp: number;
  pl: number;
  segment: AssetSegment;
  ticker: string;
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

  const assetsData: IVariableIncome[] | firebase.firestore.DocumentData = [];
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
    assets: assetsData as IVariableIncome[],
    total: totalData as ITotal,
  };
}

async function _getPrice(ticker: string) {
  const data = (await firebase
    .firestore()
    .collection("prices")
    .doc(ticker)
    .get()
    .then((v) => {
      return v.data();
    })) as IPrices;

  return data;
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

      for (const asset of assets) {
        const { id, asset: ticker, amount, price, total } = asset;

        const { atualPrice, openPrice } = await getPrice(ticker);

        const rent = Number((getRent(price, atualPrice) * amount).toFixed(2));
        const totalAtual = Number((atualPrice * amount).toFixed(2));
        const rentPercentual = realToNumber(
          getRentPercentual(price, atualPrice)
        );
        const totalOpen = Number(
          ((openPrice || atualPrice) * amount).toFixed(2)
        );

        const data = {
          totalAtual: totalAtual,
          rent: rent,
          rentPercentual: rentPercentual,
        };

        await firebase
          .firestore()
          .collection("assets")
          .doc(user.uid)
          .collection("variable")
          .doc(id.toString())
          .set(data, { merge: true });

        totalValue += rent;
        totalAtualPrice += totalAtual;
        totalMediumPrice += total;
        totalInitialPrice += totalOpen;
      }

      const [, currentDateInitial, , currentDate] = getAtualDate();
      const dateRef = currentDate as string;
      const equityData = {
        date: currentDateInitial,
        equity: Number(totalAtualPrice.toFixed(2)),
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
        .set(equityData, { merge: true });
    })
    .catch(() => {
      return Promise.reject();
    });
}

function getAssets() {
  try {
    return _getAssets();
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

export async function getPrice(ticker: string) {
  try {
    return await _getPrice(ticker);
  } catch (error) {
    console.log(error);
    throw new Error("Erro ao retornar o preço do ativo");
  }
}
