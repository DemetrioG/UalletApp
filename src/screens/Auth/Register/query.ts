import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { auth } from "../../../services/firebase";
import { RegisterDTO } from "./types";
import { createPresets } from "./presets";

export async function registerUser(formData: RegisterDTO) {
  const { email, password, confirm } = formData;

  if (password !== confirm) {
    return Promise.reject("As senhas informadas são diferentes");
  }

  createUserWithEmailAndPassword(auth, email, password)
    .then(async (user) => {
      await createPresets(user, formData);
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
