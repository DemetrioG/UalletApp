import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../../services/firebase";
import {
  currentUser,
  getExpense,
  getRevenue,
} from "../../../../utils/query.helper";
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
        getExpense(user, "Real", initialDate, finalDate, segment),
        getExpense(user, "Projetado", initialDate, finalDate, segment),
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

  const hasPlanning = result.some((item) => item.designed > 0);

  return { hasPlanning, result };
}
