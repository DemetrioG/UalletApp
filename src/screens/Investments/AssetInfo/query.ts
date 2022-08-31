import firebase from "../../../services/firebase";
import { getAtualDate } from "../../../utils/date.helper";

interface IAsset {
  id: number;
  total: number;
  amount: number;
  price: number;
  amountDeleteDate: Array<object>;
}

const defaultAsset = {
  id: 0,
  total: 0,
  amount: 0,
  price: 0,
  amountDeleteDate: [],
};

async function _deleteAsset(asset: string, uid: string, amount: number) {
  const [, date] = getAtualDate();
  let amountDeleteDate = [];
  let data: IAsset = defaultAsset;
  const item = await firebase
    .firestore()
    .collection("assets")
    .doc(uid)
    .collection("variable")
    .where("asset", "==", asset.toUpperCase())
    .get();

  if (item) {
    item.forEach((result) => {
      data = result.data() as IAsset;
      amountDeleteDate = data.amountDeleteDate || [];
    });

    if (data.amount - amount > 0) {
      amountDeleteDate.push({
        amount: amount,
        date: date,
      });

      return firebase
        .firestore()
        .collection("assets")
        .doc(uid)
        .collection("variable")
        .doc(data.id.toString())
        .set(
          {
            amountDeleteDate: amountDeleteDate,
            total: data.total - data.price * amount,
            amount: data.amount - amount,
          },
          { merge: true }
        );
    } else {
      return firebase
        .firestore()
        .collection("assets")
        .doc(uid)
        .collection("variable")
        .doc(data.id.toString())
        .delete();
    }
  }
}

export function deleteAsset(asset: string, uid: string, amount: number) {
  try {
    return _deleteAsset(asset, uid, amount);
  } catch (error) {
    throw new Error("Erro");
  }
}
