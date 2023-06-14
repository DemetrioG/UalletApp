import firebase from "@services/firebase";
import { getFinalDateMonth } from "../../../utils/date.helper";
import { currentUser } from "../../../utils/query.helper";

type TEntryList = { month: number; year: number; modality: string };
export const getEntryList = async ({ month, year, modality }: TEntryList) => {
  const user = await currentUser();
  if (!user) return Promise.reject(null);

  const initialDate = new Date(`${month}/01/${year} 00:00:00`);
  const finalDate = new Date(
    `${month}/${getFinalDateMonth(month, year)}/${year} 23:59:59`
  );

  return firebase
    .firestore()
    .collection("entry")
    .doc(user.uid)
    .collection(modality)
    .where("date", ">=", initialDate)
    .where("date", "<=", finalDate)
    .orderBy("date", "desc")
    .get();
};
