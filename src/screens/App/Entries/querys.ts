import firebase from "../../../services/firebase";
import {
  convertDateFromDatabase,
  convertDateToDatabase,
  getFinalDateMonth,
} from "../../../utils/date.helper";
import { realToNumber } from "../../../utils/number.helper";
import {
  createCollection,
  currentUser,
  updateCurrentBalance,
} from "../../../utils/query.helper";
import { ServerFilterFields } from "./ModalFilter/types";
import { ListEntries, NewEntrieDTO } from "./types";

type TEntriesList = {
  month: number;
  year: number;
  modality: string;
  filters?: ServerFilterFields;
};

export const getEntries = async ({
  month,
  year,
  modality,
  filters,
}: TEntriesList) => {
  const user = await currentUser();
  if (!user) return Promise.reject(null);

  const initialDate = new Date(`${month}/01/${year} 00:00:00`);
  const finalDate = new Date(
    `${month}/${getFinalDateMonth(month, year)}/${year} 23:59:59`
  );

  let baseQuery: firebase.firestore.Query = firebase
    .firestore()
    .collection("entry")
    .doc(user.uid)
    .collection(modality);

  if (filters?.segment)
    baseQuery = baseQuery.where("segment", "==", filters?.segment);

  if (filters?.type) baseQuery = baseQuery.where("type", "==", filters?.type);

  if (filters?.initial_date) {
    baseQuery = baseQuery.where(
      "date",
      ">=",
      convertDateToDatabase(filters?.initial_date)
    );
  } else {
    baseQuery = baseQuery.where("date", ">=", initialDate);
  }

  if (filters?.final_date) {
    baseQuery = baseQuery.where(
      "date",
      "<=",
      convertDateToDatabase(filters?.final_date)
    );
  } else {
    baseQuery = baseQuery.where("date", "<=", finalDate);
  }

  return baseQuery.orderBy("date", "desc").get();
};

async function _registerNewEntry(props: NewEntrieDTO) {
  const user = await currentUser();

  if (!user) return Promise.reject();

  const { description, date, value, modality, segment, type } = props;
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

  const items: ListEntries & {
    consolidated?: { consolidated: boolean; wasActionShown: boolean };
  } = {
    id: id,
    date: convertDateToDatabase(date),
    type: type,
    description: description,
    modality: modality!,
    value: realToNumber(value),
  };

  if (modality === "Projetado") {
    items["consolidated"] = {
      consolidated: false,
      wasActionShown: false,
    };
  }

  if (segment) {
    items["segment"] = segment;
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

  const docRef = `${Number(date.slice(3, 5)).toString()}_${date.slice(6, 10)}`;
  await updateCurrentBalance({
    modality: modality,
    sumBalance: type === "Receita",
    docDate: docRef,
    value: realToNumber(value),
  });

  return Promise.resolve();
}

async function _updateEntry(
  props: NewEntrieDTO,
  idRegister: number,
  routeParams: ListEntries
) {
  const user = await currentUser();

  if (!user) return Promise.reject();

  const { description, date, value, modality, segment, type } = props;

  const items: ListEntries & {
    consolidated?: { consolidated: boolean; wasActionShown: boolean };
  } = {
    id: idRegister,
    date: convertDateToDatabase(date),
    type: type,
    description: description,
    modality: modality,
    value: realToNumber(value),
  };

  if (modality === "Projetado") {
    items["consolidated"] = {
      consolidated: false,
      wasActionShown: false,
    };
  }

  if (segment) {
    items["segment"] = segment;
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

  const docRef = `${Number(date.slice(3, 5)).toString()}_${date.slice(6, 10)}`;
  await updateCurrentBalance({
    modality: modality,
    sumBalance: type === "Receita",
    docDate: docRef,
    value: realToNumber(value) - routeParams.value,
  });

  return Promise.resolve();
}

async function _deleteEntry(routeParams: ListEntries) {
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

export function registerNewEntry(props: NewEntrieDTO) {
  try {
    return _registerNewEntry(props);
  } catch (error) {
    console.log(error);
    throw new Error("Erro ao cadastrar lançamento");
  }
}

export function updateEntry(
  props: NewEntrieDTO,
  idRegister: number,
  routeParams: ListEntries
) {
  try {
    return _updateEntry(props, idRegister, routeParams);
  } catch (error) {
    console.log(error);
    throw new Error("Erro ao atualizar lançamento");
  }
}

export function deleteEntry(routeParams: ListEntries) {
  try {
    return _deleteEntry(routeParams);
  } catch (error) {
    console.log(error);
    throw new Error("Erro ao excluir o lançamento");
  }
}
