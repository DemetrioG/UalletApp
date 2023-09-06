import { UserCredential } from "firebase/auth";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { db } from "../../../../services/firebase";
import { addDays } from "date-fns";
import { RegisterDTO } from "../types";
import { AccountDTO } from "../../../App/Configurations/Records/Account/types";

export async function userPreset(user: UserCredential, formData: RegisterDTO) {
  return await setDoc(doc(collection(db, "users"), user.user?.uid), {
    name: formData.name,
    email: formData.email,
    typeUser: "default",
    dateRegister: serverTimestamp(),
    expirationDate: addDays(new Date(), 7),
    schema: "free",
  });
}

export async function accountPreset(user: UserCredential) {
  const data: AccountDTO = {
    name: "Carteira",
    balance: 0,
  };
  return await addDoc(collection(db, "accounts", user.user?.uid), data);
}
