import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../../../services/firebase";
import { currentUser, getRevenue } from "../../../../utils/query.helper";
import { getMonthDate } from "../../../../utils/date.helper";

interface GetPlanningProps {
  month: number;
  year: number;
}

export async function getPlanning(props: GetPlanningProps) {
  const user = await currentUser();
  if (!user) return Promise.reject(false);

  const [initialDate, finalDate] = getMonthDate(props.month, props.year);

  const [revenueReal, revenueProjetado] = await Promise.all([
    getRevenue(user, "Real", initialDate, finalDate),
    getRevenue(user, "Projetado", initialDate, finalDate),
  ]);
  const percentual = (revenueReal / revenueProjetado) * 100;

  const segments = await getDocs(
    collection(db, "segments", user.uid, "segments")
  );

  const expenseBySegment = await Promise.all(
    segments.docs.map(async (doc) => {
      const segment = doc.data().description;
      const [expenseReal, expenseProjetado] = await Promise.all([
        getExpense(user, "Real", segment, initialDate, finalDate),
        getExpense(user, "Projetado", segment, initialDate, finalDate),
      ]);
      const percentual = (expenseReal / expenseProjetado) * 100;
      return {
        description: segment,
        realized: expenseReal,
        designed: expenseProjetado,
        percentual: percentual,
      };
    })
  );

  const result = [
    {
      description: "Receita",
      realized: revenueReal,
      designed: revenueProjetado,
      percentual: percentual,
    },
    ...expenseBySegment,
  ];

  return result;
}

async function getExpense(
  user: any,
  modality: "Real" | "Projetado",
  segment: string,
  initialDate: Date,
  finalDate: Date
) {
  const queryRef = collection(db, "entry", user.uid, modality);
  const querySnapshot = await getDocs(
    query(
      queryRef,
      where("date", ">=", initialDate),
      where("date", "<=", finalDate),
      where("segment", "==", segment)
    )
  );

  return querySnapshot.docs.reduce(
    (acc, doc) => acc + (doc.data().value || 0),
    0
  );
}
