import {
  collection,
  query,
  where,
  getDocs,
  doc,
  orderBy,
  limit,
  setDoc,
} from "firebase/firestore";
import {
  ITimestamp,
  convertDateFromDatabase,
  convertDateToDatabase,
  getMonthDate,
} from "../../../../utils/date.helper";
import {
  currentUser,
  updateCurrentBalance,
} from "../../../../utils/query.helper";
import { db } from "../../../../services/firebase";
import { ItemListType } from "./types";
import { ListEntries } from "../../Entries/types";

interface ReproduceDataProps {
  data: ItemListType[];
  month: number;
  year: number;
}

export async function reproduceData(props: ReproduceDataProps) {
  const user = await currentUser();
  if (!user) return Promise.reject(false);

  try {
    const entryRef = collection(db, "entry");
    const userDocRef = doc(entryRef, user.uid);
    const projetadoCollectionRef = collection(userDocRef, "Projetado");

    let newId = 1;
    const querySnapshot = await getDocs(
      query(projetadoCollectionRef, orderBy("id", "desc"), limit(1))
    );

    querySnapshot.forEach((doc) => {
      newId += doc.data().id;
    });

    for (const item of props.data) {
      const { date, description, segment, type, value, checked, account } =
        item;

      const dateRef = getDateToNewEntrie(date, props.month, props.year);

      if (checked) {
        const item: ListEntries = {
          id: newId,
          date: convertDateToDatabase(dateRef),
          type: type,
          description: description,
          modality: "Projetado",
          value: value,
          account,
        };

        if (segment) {
          item["segment"] = segment;
        }

        await setDoc(doc(projetadoCollectionRef, newId.toString()), item);

        const docRef = `${Number(
          dateRef.slice(3, 5)
        ).toString()}_${dateRef.slice(6, 10)}`;

        await updateCurrentBalance({
          modality: "Projetado",
          sumBalance: type === "Receita",
          docDate: docRef,
          value: value,
          account,
        });

        return Promise.resolve("Dados consolidados com sucesso");
      }
    }
  } catch (error) {
    return Promise.reject("Erro ao consolidar as informações");
  }
}

export async function getData(monthRef: string) {
  const user = await currentUser();
  if (!user) return Promise.reject(false);

  const [month, year] = monthRef.split("/");
  const [initialDate, finalDate] = getMonthDate(Number(month), Number(year));

  const projetadoRef = collection(db, "entry", user.uid, "Projetado");
  const q = query(
    projetadoRef,
    where("date", ">=", initialDate),
    where("date", "<=", finalDate)
  );

  try {
    const querySnapshot = await getDocs(q);
    const data = querySnapshot.docs.map((doc) => doc.data());

    return data as ItemListType[];
  } catch (error) {
    return Promise.reject("Erro ao buscar os dados");
  }
}

function getDateToNewEntrie(
  entrieDate: ITimestamp,
  monthRef: number,
  yearRef: number
) {
  const dateFormatted = convertDateFromDatabase(entrieDate);
  const [day] = dateFormatted.split("/");
  const formattedMonth = monthRef.toString().padStart(2, "0");
  const formattedYear = yearRef.toString();
  const dateRef = `${day}/${formattedMonth}/${formattedYear}`;
  return dateRef;
}
