import firebase from "@services/firebase";
import { currentUser } from "../../../utils/query.helper";

type LastIdFromEntryProps = { modality: string };
export const lastIdFromEntry = async ({ modality }: LastIdFromEntryProps) => {
  const user = await currentUser();

  if (!user) return -1;

  let id = 0;

  const results = await firebase
    .firestore()
    .collection("entry")
    .doc(user.uid)
    .collection(modality!)
    .orderBy("id", "desc")
    .limit(1)
    .get();

  results.forEach((result) => {
    id += result.data().id;
  });

  return id;
};

type InserNewEntryProps = {
  modality: string;
  id: number;
  date: firebase.firestore.Timestamp;
  type: string;
  description: string;
  classification: string;
  segment: string;
  value: number;
};

export const insertNewEntry = async (props: InserNewEntryProps) => {
  const user = await currentUser();

  if (!user) return Promise.resolve(false);

  try {
    await firebase
      .firestore()
      .collection("entry")
      .doc(user.uid)
      .collection(props.modality!)
      .doc(props.id.toString())
      .set(props);
    return Promise.resolve(true);
  } catch (e) {
    console.error(e);
    return Promise.reject(false);
  }
};
