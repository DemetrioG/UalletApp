import firebase from "firebase";
import { currentUser } from "../../../../utils/query.helper";

async function _registerAlert(value: number) {
  const user = await currentUser();

  if (!user) return Promise.reject();

  await firebase.firestore().collection("alerts").doc(user.uid).set(
    {
      variableExpense: value,
    },
    { merge: true }
  );
}

export function registerAlert(value: number) {
  try {
    return _registerAlert(value);
  } catch (error) {
    console.log(error);
    throw new Error("Erro ao definir alerta");
  }
}
