import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../../../services/firebase";
import { currentUser } from "../../../../utils/query.helper";
import { getFinalDateMonth } from "../../../../utils/date.helper";

interface GetPlanningProps {
  month: number;
  year: number;
}

export async function getPlanning(props: GetPlanningProps, modality: "Real" | "Projetado") {
  const user = await currentUser();
  if (!user) return Promise.reject(false);

  const initialDate = new Date(`${props.year}-${props.month}-01T00:00:00`);
  const finalDate = new Date(
    `${props.year}-${props.month}-${getFinalDateMonth(props.month, props.year)}T23:59:59`
  );

  const queryRef = collection(db, "entry", user.uid, modality);
  const querySnapshot = await getDocs(
    query(
      queryRef,
      where("date", ">=", initialDate),
      where("date", "<=", finalDate),
      where("type", "==", "Receita")
    )
  );

  const sum = querySnapshot.docs.reduce((acc, doc) => acc + (doc.data().value || 0), 0);
}
