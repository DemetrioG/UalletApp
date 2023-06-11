import firebase from "@services/firebase";
import { IEntryList } from "../../screens/Entry";
import { convertDateFromDatabase, getAtualDate } from "../../utils/date.helper";
import { currentUser, updateCurrentBalance } from "../../utils/query.helper";

type IConsolidate = Array<
  (IEntryList & { checked?: boolean }) | firebase.firestore.DocumentData
>;

async function _consolidateData(data: IConsolidate) {
  const user = await currentUser();

  if (!user) return Promise.reject(false);

  let newId = 1;
  // Busca o último ID de lançamentos cadastrados no banco para setar o próximo ID
  await firebase
    .firestore()
    .collection("entry")
    .doc(user.uid)
    .collection("Real")
    .orderBy("id", "desc")
    .limit(1)
    .get()
    .then((v) => {
      v.forEach((result) => {
        newId += result.data().id;
      });
    });

  for (const item of data) {
    const { date, description, segment, type, value, id, checked } = item;
    await firebase
      .firestore()
      .collection("entry")
      .doc(user.uid)
      .collection("Projetado")
      .doc(id.toString())
      .set(
        {
          consolidated: {
            consolidated: checked,
            wasActionShown: true,
          },
        },
        { merge: true }
      )
      .catch(() => {
        return Promise.reject("Erro");
      });

    if (checked) {
      await firebase
        .firestore()
        .collection("entry")
        .doc(user.uid)
        .collection("Real")
        .doc(newId.toString())
        .set({
          id: newId,
          date: date,
          type: type,
          description: description,
          modality: "Real",
          segment: segment,
          value: value,
        })
        .catch(() => {
          return Promise.reject("Erro ao consolidar as informações");
        });

      const docRef = `${Number(
        convertDateFromDatabase(date).slice(3, 5)
      ).toString()}_${convertDateFromDatabase(date).slice(6, 10)}`;
      await updateCurrentBalance({
        modality: "Real",
        sumBalance: type === "Receita",
        docDate: docRef,
        value: value,
      });

      return Promise.resolve("Dados consolidados com sucesso");
    }
  }
}

async function _getData() {
  const user = await currentUser();

  if (!user) return Promise.reject(false);

  const [, initialDate, finalDate] = getAtualDate();

  return await firebase
    .firestore()
    .collection("entry")
    .doc(user.uid)
    .collection("Projetado")
    .where("date", ">=", initialDate)
    .where("date", "<=", finalDate)
    .where("consolidated.wasActionShown", "==", false)
    .get()
    .then((v) => {
      const data: IConsolidate = [];
      v.forEach((result) => {
        data.push(result.data());
      });
      return data;
    })
    .catch(() => Promise.reject("Erro ao buscar os dados"));
}

export function consolidateData(data: IConsolidate) {
  try {
    return _consolidateData(data);
  } catch (error) {
    console.log(error);
    throw new Error("Erro");
  }
}

export function getData() {
  try {
    return _getData();
  } catch (error) {
    console.log(error);
    throw new Error("Erro");
  }
}
