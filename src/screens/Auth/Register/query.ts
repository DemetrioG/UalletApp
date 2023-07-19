import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { auth, db } from "../../../services/firebase";
import { RegisterDTO } from "./types";
import { collection, doc, serverTimestamp, setDoc } from "firebase/firestore";

export async function registerUser(props: RegisterDTO) {
  const { name, email, password, confirm } = props;

  if (password !== confirm) {
    return Promise.reject("As senhas informadas são diferentes");
  }

  createUserWithEmailAndPassword(auth, email, password)
    .then((v) => {
      setDoc(doc(collection(db, "users"), v.user?.uid), {
        name: name,
        email: email,
        typeUser: "default",
        dateRegister: serverTimestamp(),
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
