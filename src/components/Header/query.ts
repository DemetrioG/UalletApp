import firebase from "../../services/firebase";
import { currentUser } from "../../utils/query.helper";

async function _getData() {
  const user = await currentUser();

  if (!user) return Promise.reject(false);

  const defaultData = {
    name: "",
    completeName: "",
    email: "",
  };

  return await firebase
    .firestore()
    .collection("users")
    .doc(user.uid)
    .get()
    .then((v) => {
      const data = {
        name: v.data()?.name.split(" ", 1).toString(),
        completeName: v.data()?.name,
        email: v.data()?.email,
      };
      return data;
    })
    .catch(() => {
      return defaultData;
    });
}

export function getData() {
  try {
    return _getData();
  } catch (error) {
    console.log(error);
    throw new Error("Erro");
  }
}
