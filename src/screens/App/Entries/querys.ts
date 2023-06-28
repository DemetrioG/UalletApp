import firebase from "../../../services/firebase";
import {
  convertDateToDatabase,
  getFinalDateMonth,
} from "../../../utils/date.helper";
import { currentUser } from "../../../utils/query.helper";
import { IActiveFilter } from "./Filter/helper";

type TEntriesList = {
  month: number;
  year: number;
  modality: string;
  filters: IActiveFilter;
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

  if (filters.description)
    baseQuery = baseQuery.where("description", "==", filters.description);

  if (filters.segment)
    baseQuery = baseQuery.where("segment", "==", filters.segment);

  if (filters.typeEntry)
    baseQuery = baseQuery.where("type", "==", filters.typeEntry);

  if (filters.initialDate) {
    baseQuery = baseQuery.where(
      "date",
      ">=",
      convertDateToDatabase(filters.initialDate)
    );
  } else {
    baseQuery = baseQuery.where("date", ">=", initialDate);
  }

  if (filters.finalDate) {
    baseQuery = baseQuery.where(
      "date",
      "<=",
      convertDateToDatabase(filters.finalDate)
    );
  } else {
    baseQuery = baseQuery.where("date", "<=", finalDate);
  }

  return baseQuery.orderBy("date", "desc").get();
};
