import firebase from "firebase";

type TUpdateUserData = {
  birthDate: string,
  gender: string,
  income: string,
  profile: string,
}

export const updateUserData = async (userData: TUpdateUserData): Promise<string> => {
  try {
    const user = firebase.auth().currentUser;
    if (!user) throw new Error("Úsuario não encontrado");

    await firebase.firestore()
      .collection("users")
      .doc(user.uid)
      .set(userData, { merge: true });

    return Promise.resolve("Dados cadastrados com sucesso")
  }
  catch {
    return Promise.reject("Erro ao cadastrar as informações");
  }
}