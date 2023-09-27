import { collection, doc, setDoc } from "firebase/firestore";
import { db } from "../../../services/firebase";
import { authUser } from "../../../utils/query.helper";

type TUpdateUserData = {
  birthDate: string;
  gender: string | null;
  income: string;
  profile: string | null;
};

export const updateUserData = async (
  userData: TUpdateUserData
): Promise<string> => {
  try {
    const user = await authUser();
    if (!user) throw new Error("Úsuario não encontrado");

    await setDoc(doc(collection(db, "users"), user.uid), userData, {
      merge: true,
    });

    return Promise.resolve("Dados cadastrados com sucesso");
  } catch {
    return Promise.reject("Erro ao cadastrar as informações");
  }
};
