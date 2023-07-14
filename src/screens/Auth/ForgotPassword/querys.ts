import { getAuth, sendPasswordResetEmail } from "firebase/auth";

export const resetPassword = async (email: string): Promise<string> => {
  try {
    const auth = getAuth();
    await sendPasswordResetEmail(auth, email);
    return Promise.resolve(
      "E-mail de redefinição enviado!\nVerifique sua caixa de SPAM"
    );
  } catch {
    return Promise.reject("E-mail não encontrado");
  }
};
