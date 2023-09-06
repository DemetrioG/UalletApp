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

export async function createPresets(
  user: UserCredential,
  formData: RegisterDTO
) {
  await Promise.all([
    userPreset(user, formData),
    accountPreset(user),
    segmentPreset(user),
  ]);
}

async function userPreset(user: UserCredential, formData: RegisterDTO) {
  return await setDoc(doc(collection(db, "users"), user.user?.uid), {
    name: formData.name,
    email: formData.email,
    typeUser: "default",
    dateRegister: serverTimestamp(),
    expirationDate: addDays(new Date(), 7),
    schema: "free",
  });
}

async function accountPreset(user: UserCredential) {
  const data = {
    name: "Carteira",
    balance: 0,
  };
  return await addDoc(
    collection(db, "accounts", user.user?.uid, "accounts"),
    data
  );
}

async function segmentPreset(user: UserCredential) {
  const data = [
    {
      description: "Alimentação",
    },
    {
      description: "Lazer",
    },
    {
      description: "Educação",
    },
    {
      description: "Empréstimos",
    },
    {
      description: "Necessidades",
    },
  ];

  const addSegments = data.map((item) => {
    return addDoc(collection(db, "segments", user.user?.uid, "segments"), item);
  });

  return await Promise.all(addSegments);
}
