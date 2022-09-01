import firebase from "../../services/firebase";
import { currentUser } from "../../utils/query.helper";

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

type UpdateCurrentBalanceProps = {
  modality: string;
  docDate: string;
  value: number;
};
export const updateCurrentBalance = async ({
  modality,
  docDate,
  value,
}: UpdateCurrentBalanceProps) => {
  const user = await currentUser();

  if (!user) return Promise.resolve(false);

  let balance = 0;
  await firebase
    .firestore()
    .collection("balance")
    .doc(user.uid)
    .collection(modality!)
    .doc(docDate)
    .get()
    .then((v) => {
      balance = v.data()?.balance || 0;
    })
    .catch(() => Promise.reject(false));

  balance -= value;

  return firebase
    .firestore()
    .collection("balance")
    .doc(user.uid)
    .collection(modality!)
    .doc(docDate)
    .set({
      balance: balance,
    })
    .then(() => Promise.resolve(true))
    .catch(() => Promise.resolve(false));
};
