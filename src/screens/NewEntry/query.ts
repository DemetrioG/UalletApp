import firebase from "../../services/firebase";
import {
  createCollection,
  currentUser,
  updateCurrentBalance,
} from "../../utils/query.helper";
import { IEntryList } from "../Entry";
import {
  convertDateFromDatabase,
  convertDateToDatabase,
} from "../../utils/date.helper";
import { realToNumber } from "../../utils/number.helper";
import { TEntryType } from "../../types/types";

export interface INewEntry {
  description: string;
  entrydate: string;
  value: string;
  classification: string;
  modality: "Real" | "Projetado";
  type: TEntryType;
  segment: string;
}

async function _registerNewEntry(props: INewEntry) {
  const user = await currentUser();

  if (!user) return Promise.reject();

  const {
    description,
    entrydate,
    value,
    modality,
    segment,
    type,
    classification,
  } = props;
  let id = 1;

  /**
   * Busca o último ID de lançamentos cadastrados no banco para setar o próximo ID
   */
  await firebase
    .firestore()
    .collection("entry")
    .doc(user.uid)
    .collection(modality)
    .orderBy("id", "desc")
    .limit(1)
    .get()
    .then((v) => {
      v.forEach((result) => {
        id += result.data().id;
      });
    });

  const items: IEntryList & {
    consolidated?: { consolidated: boolean; wasActionShown: boolean };
  } = {
    id: id,
    date: convertDateToDatabase(entrydate),
    type: type,
    description: description,
    modality: modality!,
    classification: classification,
    segment: segment,
    value: realToNumber(value),
  };

  if (modality === "Projetado") {
    items["consolidated"] = {
      consolidated: false,
      wasActionShown: false,
    };
  }

  await createCollection("entry");

  /**
   *  Registra o novo lançamento no banco
   */
  await firebase
    .firestore()
    .collection("entry")
    .doc(user.uid)
    .collection(modality!)
    .doc(id.toString())
    .set(items);

  await createCollection("balance");

  const docRef = `${Number(entrydate.slice(3, 5)).toString()}_${entrydate.slice(
    6,
    10
  )}`;
  await updateCurrentBalance({
    modality: modality,
    sumBalance: type === "Receita",
    docDate: docRef,
    value: realToNumber(value),
  });

  return Promise.resolve();
}

async function _updateEntry(
  props: INewEntry,
  idRegister: number,
  routeParams: IEntryList
) {
  const user = await currentUser();

  if (!user) return Promise.reject();

  const {
    description,
    entrydate,
    value,
    modality,
    segment,
    type,
    classification,
  } = props;

  const items: IEntryList & {
    consolidated?: { consolidated: boolean; wasActionShown: boolean };
  } = {
    id: idRegister,
    date: convertDateToDatabase(entrydate),
    type: type,
    description: description,
    modality: modality!,
    classification: classification,
    segment: segment,
    value: realToNumber(value),
  };

  if (modality === "Projetado") {
    items["consolidated"] = {
      consolidated: false,
      wasActionShown: false,
    };
  }

  await createCollection("entry");

  /**
   * Registra o novo lançamento no banco
   */
  await firebase
    .firestore()
    .collection("entry")
    .doc(user.uid)
    .collection(modality!)
    .doc(idRegister.toString())
    .set(items);

  await createCollection("balance");

  const docRef = `${Number(entrydate.slice(3, 5)).toString()}_${entrydate.slice(
    6,
    10
  )}`;
  await updateCurrentBalance({
    modality: modality,
    sumBalance: type === "Receita",
    docDate: docRef,
    value: realToNumber(value) - routeParams.value,
  });

  return Promise.resolve();
}

async function _deleteEntry(routeParams: IEntryList) {
  const { date, id, modality, type, value } = routeParams;
  const user = await currentUser();

  if (!user) return Promise.reject();

  await firebase
    .firestore()
    .collection("entry")
    .doc(user.uid)
    .collection(modality)
    .doc(id.toString())
    .delete();

  const docRef = `${Number(
    convertDateFromDatabase(date).slice(3, 5)
  ).toString()}_${convertDateFromDatabase(date).slice(6, 10)}`;
  await updateCurrentBalance({
    modality: modality,
    docDate: docRef,
    sumBalance: type === "Despesa",
    value: value,
  });

  return Promise.resolve();
}

export function registerNewEntry(props: INewEntry) {
  try {
    return _registerNewEntry(props);
  } catch (error) {
    console.log(error);
    throw new Error("Erro ao cadastrar lançamento");
  }
}

export function updateEntry(
  props: INewEntry,
  idRegister: number,
  routeParams: IEntryList
) {
  try {
    return _updateEntry(props, idRegister, routeParams);
  } catch (error) {
    console.log(error);
    throw new Error("Erro ao atualizar lançamento");
  }
}

export function deleteEntry(routeParams: IEntryList) {
  try {
    return _deleteEntry(routeParams);
  } catch (error) {
    console.log(error);
    throw new Error("Erro ao excluir o lançamento");
  }
}
