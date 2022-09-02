import firebase from "../../../services/firebase";
import { convertDateToDatabase } from "../../../utils/date.helper";
import {
  averageBetweenNumbers,
  realToNumber,
} from "../../../utils/number.helper";

export interface IAsset {
  entrydate: string;
  segment: "Ações" | "FIIs e Fiagro" | "Criptomoedas" | "BDR's" | null;
  broker: string | null;
  asset: string;
  amount: number;
  price: string;
  total: string;
  uid: string;
}

interface IAssetDatabase {
  id: number;
  amount: number;
  amountBuyDate: object[];
  asset: string;
  broker: string;
  price: number;
  segment: string;
  total: number;
}

async function _registerAsset(props: IAsset) {
  const { entrydate, segment, broker, asset, amount, price, total, uid } =
    props;

  let id = 1;
  let itemIsInDatabase: IAssetDatabase = undefined;
  const item = await firebase
    .firestore()
    .collection("assets")
    .doc(uid)
    .collection("variable")
    .where("asset", "==", asset.toUpperCase())
    .get();

  item.forEach((result) => {
    id = result.data().id;
    itemIsInDatabase = result.data() as IAssetDatabase;
  });

  if (!itemIsInDatabase) {
    // Busca o último ID de lançamentos cadastrados no banco para setar o próximo ID
    const response = await firebase
      .firestore()
      .collection("assets")
      .doc(uid)
      .collection("variable")
      .orderBy("id", "desc")
      .limit(1)
      .get();

    response.forEach((result) => {
      id += result.data().id;
    });
  }

  const amountBuyDate = itemIsInDatabase?.amountBuyDate || [];
  amountBuyDate.push({
    amount: amount,
    date: convertDateToDatabase(entrydate),
    price: realToNumber(price),
  });

  const items: IAssetDatabase = {
    id: id,
    amountBuyDate: amountBuyDate,
    segment: segment!,
    broker: broker!,
    asset: asset.toUpperCase(),
    amount: amount + (itemIsInDatabase?.amount || 0),
    price: averageBetweenNumbers(
      realToNumber(price),
      itemIsInDatabase?.price || realToNumber(price)
    ),
    total: realToNumber(total) + (itemIsInDatabase?.total || 0),
  };

  /**
   * Esta query é setada, pois caso contrário, o firebase criar a coleção como virtualizada, sendo assim, não é possível ter acesso à ela.
   */
  await firebase
    .firestore()
    .collection("assets")
    .doc(uid)
    .set({ created: true });

  return firebase
    .firestore()
    .collection("assets")
    .doc(uid)
    .collection("variable")
    .doc(id.toString())
    .set(items, { merge: true });
}

export function registerAsset(props: IAsset) {
  try {
    return _registerAsset(props);
  } catch (error) {
    throw new Error("Erro");
  }
}
