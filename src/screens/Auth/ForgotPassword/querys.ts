import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../../services/firebase";

export const resetPassword = async (email: string): Promise<string> => {
  try {
    await sendPasswordResetEmail(auth, email);
    return Promise.resolve(
      "E-mail de redefinição enviado!\nVerifique sua caixa de SPAM"
    );
  } catch {
    return Promise.reject("E-mail não encontrado");
  }
};
