import { doc, getDoc } from "firebase/firestore";
import { currentUser } from "../../../utils/query.helper";
import { ValidatedTicketsDTO } from "./types";
import { EMAIL } from "@env";
import { db } from "../../../services/firebase";

export async function sendTicket(formData: ValidatedTicketsDTO) {
  const user = await currentUser();
  if (!user) return Promise.reject(false);

  const userDoc = await getDoc(doc(db, "users", user.uid));

  if (!userDoc.exists()) return Promise.reject("Usuário não encontrado.");

  const userData = userDoc.data();

  return await fetch(`https://formsubmit.co/ajax/${EMAIL.toString()}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      _template: "table",
      _subject: `Ticket Uallet [${formData.type}]`,
      email: userData?.email,
      nome: userData?.name,
      schema: userData?.schema,
      profile: userData?.profile,
      tipo: formData.type,
      descricao: formData.comment,
    }),
  });
}
