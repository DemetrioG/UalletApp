import firebase from "../../services/firebase";
import { currentUser } from "../../utils/query.helper";

type LastIdFromEntryProps = { modality: string }
export const lastIdFromEntry = async ({ modality }: LastIdFromEntryProps) => {
  const user = currentUser();

  if (!user) return -1;

  let id = 0;

  const results = await firebase
    .firestore()
    .collection("entry")
    .doc(user.uid)
    .collection(modality!)
    .orderBy("id", "desc")
    .limit(1)
    .get()

  results.forEach((result) => {
    id += result.data().id;
  });

  return id;
}


type InserNewEntryProps = {
  modality: string,
  id: number,
  date: firebase.firestore.Timestamp,
  type: string,
  description: string,
  segment: string,
  value: number
}

export const insertNewEntry = async ({ modality, ...props }: InserNewEntryProps) => {
  const user = currentUser();

  if (!user) return Promise.resolve(false);

  try {
    await firebase.firestore()
      .collection("entry")
      .doc(user.uid)
      .collection(modality!)
      .doc(props.id.toString())
      .set(props);
    Promise.resolve(true);
  }
  catch (e) {
    console.error(e);
    Promise.reject(false);
  }
}

type UpdateCurrentBalanceProps = { modality: string, docDate: string, value: number }
export const updateCurrentBalance = ({ modality, docDate, value }: UpdateCurrentBalanceProps) => {
  const user = currentUser();

  if (!user) return Promise.resolve(false);

  let balance = 0;
  firebase
    .firestore()
    .collection("balance")
    .doc(user.uid)
    .collection(modality!)
    .doc(docDate)
    .get()
    .then((v) => {
      balance = v.data()?.balance || 0;
    }).catch(() => Promise.reject(false));

  balance -= value;

  firebase
    .firestore()
    .collection("balance")
    .doc(user.uid)
    .collection(modality!)
    .doc(docDate)
    .set({
      balance: balance,
    }).then(() => Promise.resolve(true))
    .catch(() => Promise.resolve(false));
}