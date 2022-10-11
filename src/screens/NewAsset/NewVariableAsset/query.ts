import { IForm } from ".";
import firebase from "../../../services/firebase";
import { IVariableIncome } from "../../../types/assets";
import { convertDateToDatabase } from "../../../utils/date.helper";
import {
  averageBetweenNumbers,
  realToNumber,
} from "../../../utils/number.helper";
import { createCollection, currentUser } from "../../../utils/query.helper";

async function _registerAsset(props: IForm) {
  const { entrydate, segment, broker, asset, amount, price, total } = props;

  const user = await currentUser();

  if (!user) return Promise.reject();

  let id = 1;
  let itemIsInDatabase: IVariableIncome = undefined;
  const item = await firebase
    .firestore()
    .collection("assets")
    .doc(user.uid)
    .collection("variable")
    .where("asset", "==", asset.toUpperCase())
    .get();

  item.forEach((result) => {
    id = result.data().id;
    itemIsInDatabase = result.data() as IVariableIncome;
  });

  if (!itemIsInDatabase) {
    // Busca o último ID de lançamentos cadastrados no banco para setar o próximo ID
    const response = await firebase
      .firestore()
      .collection("assets")
      .doc(user.uid)
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

  const items: IVariableIncome = {
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
    total: realToNumber(total || "0,00") + (itemIsInDatabase?.total || 0),
  };

  await createCollection("assets");

  return firebase
    .firestore()
    .collection("assets")
    .doc(user.uid)
    .collection("variable")
    .doc(id.toString())
    .set(items, { merge: true });
}

export function registerAsset(props: IForm) {
  try {
    return _registerAsset(props);
  } catch (error) {
    throw new Error("Erro");
  }
}
