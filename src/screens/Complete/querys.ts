import firebase from "../../services/firebase";
import { currentUser } from "../../utils/query.helper";

type TUpdateUserData = {
  birthDate: string,
  gender: string | null,
  income: string,
  profile: string | null,
}

export const updateUserData = async (userData: TUpdateUserData): Promise<string> => {
  try {
    const user = currentUser();
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