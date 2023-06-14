import { IForm } from ".";
import firebase from "../../../../services/firebase";
import { convertDateToDatabase } from "../../../../utils/date.helper";
import { realToNumber } from "../../../../utils/number.helper";
import { currentUser } from "../../../../utils/query.helper";

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

async function _deleteAsset(formData: IForm) {
  const { amount, asset, price, entrydate } = formData;
  const user = await currentUser();

  if (!user) return Promise.reject();

  let amountDeleteDate = [];
  let data: IAsset = defaultAsset;
  const item = await firebase
    .firestore()
    .collection("assets")
    .doc(user.uid)
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
        date: convertDateToDatabase(entrydate),
        price: realToNumber(price),
      });

      return firebase
        .firestore()
        .collection("assets")
        .doc(user.uid)
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
        .doc(user.uid)
        .collection("variable")
        .doc(data.id.toString())
        .delete();
    }
  }
}

export function deleteAsset(formData: IForm) {
  try {
    return _deleteAsset(formData);
  } catch (error) {
    throw new Error("Erro");
  }
}
