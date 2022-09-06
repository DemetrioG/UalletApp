import firebase from "../../services/firebase";
import { IRegister } from ".";

async function _registerUser(props: IRegister) {
  const { name, email, password, confirm } = props;

  if (password !== confirm) {
    return Promise.reject("As senhas informadas são diferentes");
  }

  await firebase
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .then((v) => {
      firebase.firestore().collection("users").doc(v.user?.uid).set({
        name: name,
        email: email,
        typeUser: "default",
        dateRegister: firebase.firestore.FieldValue.serverTimestamp(),
        schema: "free",
      });
      return Promise.resolve();
    })
    .catch((error) => {
      switch (error.code) {
        case "auth/weak-password":
          return Promise.reject("Sua senha deve ter no mínimo 6 caracteres");
        case "auth/invalid-email":
          return Promise.reject("O e-mail informado é inválido");
        case "auth/email-already-in-use":
          return Promise.reject("Usuário já cadastrado");
        default:
          return Promise.reject("Erro ao cadastrar usuário");
      }
    });
}

export function registerUser(props: IRegister) {
  try {
    return _registerUser(props);
  } catch (error) {
    throw new Error(error as string);
  }
}
