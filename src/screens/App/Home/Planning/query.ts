import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../../../services/firebase";
import { currentUser } from "../../../../utils/query.helper";
import { getMonthDate } from "../../../../utils/date.helper";

interface GetPlanningProps {
  month: number;
  year: number;
}

export async function getPlanning(
  props: GetPlanningProps,
  modality: "Real" | "Projetado"
) {
  const user = await currentUser();
  if (!user) return Promise.reject(false);

  const [initialDate, finalDate] = getMonthDate(props.month, props.year);

  const queryRef = collection(db, "entry", user.uid, modality);
  const querySnapshot = await getDocs(
    query(
      queryRef,
      where("date", ">=", initialDate),
      where("date", "<=", finalDate),
      where("type", "==", "Receita")
    )
  );

  const sum = querySnapshot.docs.reduce(
    (acc, doc) => acc + (doc.data().value || 0),
    0
  );
}
