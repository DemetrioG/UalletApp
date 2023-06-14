import firebase from "firebase";
import { currentUser } from "../../../../utils/query.helper";

async function _getData() {
  const user = await currentUser();

  if (!user) return Promise.reject();

  return await firebase
    .firestore()
    .collection("alerts")
    .doc(user.uid)
    .get()
    .then((v) => {
      return v.data();
    });
}

export function getData() {
  try {
    return _getData();
  } catch (error) {
    console.log(error);
    throw new Error("Erro ao retornar os alertas");
  }
}

async function _deleteData(index: string) {
  const user = await currentUser();

  if (!user) return Promise.reject();

  await firebase
    .firestore()
    .collection("alerts")
    .doc(user.uid)
    .set({
      [index]: 0,
    });
}

export function deleteData(index: string) {
  try {
    return _deleteData(index);
  } catch (error) {
    console.log(error);
    throw new Error("Erro ao excluir alerta");
  }
}
