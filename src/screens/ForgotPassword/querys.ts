import firebase from "firebase";

export const resetPassword = async (email: string): Promise<string> => {
  try {
    await firebase
      .auth()
      .sendPasswordResetEmail(email)
    return Promise.resolve("E-mail de redefinição enviado!\nVerifique sua caixa de SPAM");
  }
  catch {
    return Promise.reject("E-mail não encontrado");
  }
}