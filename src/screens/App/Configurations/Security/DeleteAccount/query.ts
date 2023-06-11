import firebase from "@services/firebase";
import { currentUser } from "@utils/query.helper";

async function _deleteAccount(password: string) {
  const user = await currentUser();

  if (!user) return Promise.reject(false);
  const credential = firebase.auth.EmailAuthProvider.credential(
    user?.email,
    password
  );

  await firebase.firestore().collection("assets").doc(user.uid).delete();
  await firebase.firestore().collection("balance").doc(user.uid).delete();
  await firebase.firestore().collection("entry").doc(user.uid).delete();
  await firebase.firestore().collection("users").doc(user.uid).delete();
  await firebase.firestore().collection("alerts").doc(user.uid).delete();
  await user?.reauthenticateWithCredential(credential);
  user?.delete();
  return Promise.resolve("Success");
}

export function deleteAccount(password: string) {
  try {
    return _deleteAccount(password);
  } catch (error) {
    console.log(error);
    throw new Error("Erro");
  }
}
