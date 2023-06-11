import firebase from "../../../../../services/firebase";

export const getUser = async <T>(userUid: string) => {
  const query = await firebase
    .firestore()
    .collection("users")
    .doc(userUid)
    .get();

  return query.data() as T;
};
