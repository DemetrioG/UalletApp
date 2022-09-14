import firebase from "../../services/firebase";
import { currentUser } from "../../utils/query.helper";
import { IEntryList } from "../Entry";
import {
  convertDateFromDatabase,
  convertDateToDatabase,
} from "../../utils/date.helper";
import { realToNumber } from "../../utils/number.helper";

export interface INewEntry {
  description: string;
  entrydate: string;
  value: string;
  classification: string;
  modality: "Real" | "Projetado";
  type: "Receita" | "Despesa";
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

  /**
   * Esta query é setada, pois caso contrário, o firebase criar a coleção como virtualizada, sendo assim, não é possível ter acesso à ela.
   */
  await firebase
    .firestore()
    .collection("entry")
    .doc(user.uid)
    .set({ created: true });

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

  /**
   * Atualiza o saldo atual no banco
   */
  let balance = 0;
  await firebase
    .firestore()
    .collection("balance")
    .doc(user.uid)
    .collection(modality!)
    .doc(Number(entrydate.slice(3, 5)).toString())
    .get()
    .then((v) => {
      balance = v.data()?.balance || 0;
    });

  if (type == "Receita") {
    balance += realToNumber(value);
  } else {
    balance -= realToNumber(value);
  }

  /**
   * Esta query é setada, pois caso contrário, o firebase criar a coleção como virtualizada, sendo assim, não é possível ter acesso à ela.
   */
  await firebase
    .firestore()
    .collection("balance")
    .doc(user.uid)
    .set({ created: true });

  await firebase
    .firestore()
    .collection("balance")
    .doc(user.uid)
    .collection(modality!)
    .doc(Number(entrydate?.slice(3, 5)).toString())
    .set({
      balance: balance,
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

  /**
   * Esta query é setada, pois caso contrário, o firebase criar a coleção como virtualizada, sendo assim, não é possível ter acesso à ela.
   */
  await firebase
    .firestore()
    .collection("entry")
    .doc(user.uid)
    .set({ created: true });

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

  /**
   * Atualiza o saldo atual no banco
   */
  let balance = 0;
  await firebase
    .firestore()
    .collection("balance")
    .doc(user.uid)
    .collection(modality!)
    .doc(Number(entrydate.slice(3, 5)).toString())
    .get()
    .then((v) => {
      balance = v.data()?.balance || 0;
    });

  if (type == "Receita") {
    balance += realToNumber(value) - routeParams.value;
  } else {
    balance -= realToNumber(value) - routeParams.value;
  }

  /**
   * Esta query é setada, pois caso contrário, o firebase criar a coleção como virtualizada, sendo assim, não é possível ter acesso à ela.
   */
  await firebase
    .firestore()
    .collection("balance")
    .doc(user.uid)
    .set({ created: true });

  await firebase
    .firestore()
    .collection("balance")
    .doc(user.uid)
    .collection(modality!)
    .doc(Number(entrydate?.slice(3, 5)).toString())
    .set({
      balance: balance,
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

  /**
   * Atualiza o saldo atual no banco
   */
  let balance = 0;
  const dateMonth = Number(
    convertDateFromDatabase(date).slice(3, 5)
  ).toString();
  await firebase
    .firestore()
    .collection("balance")
    .doc(user.uid)
    .collection(modality)
    .doc(dateMonth)
    .get()
    .then((v) => {
      balance = v.data()?.balance || 0;
    });

  if (type == "Despesa") {
    balance += value;
  } else {
    balance -= value;
  }

  await firebase
    .firestore()
    .collection("balance")
    .doc(user.uid)
    .collection(modality)
    .doc(dateMonth)
    .set({
      balance: balance,
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
