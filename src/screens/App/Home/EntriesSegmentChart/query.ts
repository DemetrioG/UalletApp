import { db } from "../../../../services/firebase";
import { IData } from "../../../../context/Data/dataContext";
import { getMonthDate } from "../../../../utils/date.helper";
import { currentUser, getExpense } from "../../../../utils/query.helper";
import { collection, getDocs } from "firebase/firestore";

export async function getData(context: IData) {
  const { month, year, modality } = context;
  const user = await currentUser();
  if (!user) return Promise.reject(false);

  const [initialDate, finalDate] = getMonthDate(month, year);

  const segments = await getDocs(
    collection(db, "segments", user.uid, "segments")
  );

  const hasSegments = segments.docs.length > 0;

  const totalExpenses = await getExpense(
    user,
    modality,
    initialDate,
    finalDate
  );

  const expenseBySegment = await Promise.all(
    segments.docs.map(async (doc) => {
      const segment = doc.data().description;
      const expense = await getExpense(
        user,
        modality,
        initialDate,
        finalDate,
        segment
      );
      const percentage = (expense / totalExpenses) * 100;

      return {
        label: segment,
        value: percentage,
      };
    })
  );

  const hasExpense = expenseBySegment.some((item) => item.value > 0);

  return { expenseBySegment, hasExpense, hasSegments };
}
