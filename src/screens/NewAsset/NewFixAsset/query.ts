import firebase from "../../../services/firebase";
import { IFixedIncome, ITreasure } from "../../../types/assets";
import { convertDateToDatabase } from "../../../utils/date.helper";
import { percentualToNumber, realToNumber } from "../../../utils/number.helper";
import { createCollection } from "../../../utils/query.helper";

async function _registerAsset(props: IFixedIncome) {
  const {
    entrydate,
    broker,
    duedate,
    price,
    rent,
    title,
    uid,
    cdbname,
    rentType,
  } = props;

  let id = 1;
  // Busca o último ID de lançamentos cadastrados no banco para setar o próximo ID
  const response = await firebase
    .firestore()
    .collection("assets")
    .doc(uid)
    .collection("fixed")
    .orderBy("id", "desc")
    .limit(1)
    .get();

  response.forEach((result) => {
    id += result.data().id;
  });

  const items = {
    id: id,
    date: convertDateToDatabase(entrydate),
    title: title,
    cdbname: cdbname && cdbname.toUpperCase(),
    broker: broker,
    rent: percentualToNumber(rent),
    rentType: rentType?.toUpperCase(),
    duedate: duedate && convertDateToDatabase(duedate),
    price: realToNumber(price),
  };

  await createCollection("assets");

  return firebase
    .firestore()
    .collection("assets")
    .doc(uid)
    .collection("fixed")
    .doc(id.toString())
    .set(items);
}

async function _getTreasure() {
  return firebase
    .firestore()
    .collection("treasure")
    .get()
    .then((v) => {
      const data: ITreasure[] = [];
      v.forEach((result) => {
        data.push(result.data() as ITreasure);
      });
      return data;
    });
}

export function registerAsset(props: IFixedIncome) {
  try {
    return _registerAsset(props);
  } catch (error) {
    throw new Error("Erro ao cadastrar Renda Fixa");
  }
}

export function getTreasure() {
  try {
    return _getTreasure();
  } catch (error) {
    console.log(error);
    throw new Error("Erro ao retornar os dados de Tesouro");
  }
}
