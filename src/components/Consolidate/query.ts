import {
  collection,
  query,
  where,
  getDocs,
  doc,
  orderBy,
  limit,
  setDoc,
  DocumentData,
} from "firebase/firestore";
import { ListEntries } from "../../screens/App/Entries/types";
import { convertDateFromDatabase, getAtualDate } from "../../utils/date.helper";
import { currentUser, updateCurrentBalance } from "../../utils/query.helper";
import { db } from "../../services/firebase";

type IConsolidate = Array<(ListEntries & { checked?: boolean }) | DocumentData>;

export async function consolidateData(data: IConsolidate) {
  const user = await currentUser();

  if (!user) return Promise.reject(false);

  try {
    const entryRef = collection(db, "entry");
    const userDocRef = doc(entryRef, user.uid);
    const realCollectionRef = collection(userDocRef, "Real");
    const projetadoCollectionRef = collection(userDocRef, "Projetado");

    let newId = 1;
    const querySnapshot = await getDocs(
      query(realCollectionRef, orderBy("id", "desc"), limit(1))
    );

    querySnapshot.forEach((doc) => {
      newId += doc.data().id;
    });

    for (const item of data) {
      const { date, description, segment, type, value, id, checked } = item;

      await setDoc(
        doc(projetadoCollectionRef, id.toString()),
        {
          consolidated: {
            consolidated: checked,
            wasActionShown: true,
          },
        },
        { merge: true }
      );

      if (checked) {
        await setDoc(doc(realCollectionRef, newId.toString()), {
          id: newId,
          date: date,
          type: type,
          description: description,
          modality: "Real",
          segment: segment,
          value: value,
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
  } catch (error) {
    return Promise.reject("Erro ao consolidar as informações");
  }
}

export async function getData() {
  const user = await currentUser();

  if (!user) return Promise.reject(false);

  const [, initialDate, finalDate] = getAtualDate();

  const projetadoRef = collection(db, "entry", user.uid, "Projetado");
  const q = query(
    projetadoRef,
    where("date", ">=", initialDate),
    where("date", "<=", finalDate),
    where("consolidated.wasActionShown", "==", false)
  );

  try {
    const querySnapshot = await getDocs(q);
    const data = querySnapshot.docs.map((doc) => doc.data());

    return data as IConsolidate[];
  } catch (error) {
    return Promise.reject("Erro ao buscar os dados");
  }
}
