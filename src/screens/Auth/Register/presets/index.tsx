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
  const accountsCollectionRef = collection(
    db,
    "accounts",
    user.user?.uid,
    "accounts"
  );
  const balanceDocRef = doc(
    collection(db, "balance", user.user?.uid, "Real"),
    "balance"
  );

  const data = {
    name: "Carteira",
    value: "carteira",
    balance: 0,
    color: "#FFF",
  };

  await Promise.all([
    addDoc(accountsCollectionRef, data),
    setDoc(balanceDocRef, {
      carteira: {
        balance: 0,
      },
    }),
  ]);
}

async function segmentPreset(user: UserCredential) {
  const data = [
    {
      description: "Alimentação",
      value: "alimentacao",
    },
    {
      description: "Lazer",
      value: "lazer",
    },
    {
      description: "Educação",
      value: "educacao",
    },
    {
      description: "Empréstimos",
      value: "emprestimos",
    },
    {
      description: "Necessidades",
      value: "necessidades",
    },
  ];

  const addSegments = data.map((item) => {
    return addDoc(collection(db, "segments", user.user?.uid, "segments"), item);
  });

  return await Promise.all(addSegments);
}
