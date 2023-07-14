import { db } from "../../services/firebase";
import { IData } from "../../context/Data/dataContext";
import { getFinalDateMonth } from "../../utils/date.helper";
import { currentUser } from "../../utils/query.helper";
import { ChartProps } from "./types";
import { collection, getDocs, query, where } from "firebase/firestore";

export async function getData(context: IData, defaultData: ChartProps[]) {
  const { month, year, modality } = context;
  const user = await currentUser();

  if (!user) return Promise.reject(false);

  if (year !== 0) {
    const initialDate = new Date(`${month}/01/${year} 00:00:00`);
    const finalDate = new Date(
      `${month}/${getFinalDateMonth(month, year)}/${year} 23:59:59`
    );

    let needs = 0;
    let invest = 0;
    let leisure = 0;
    let education = 0;
    let shortAndMediumTime = 0;

    const entryCollectionRef = collection(db, "entry", user.uid, modality);

    try {
      const expensesQuery = query(
        entryCollectionRef,
        where("type", "==", "Despesa"),
        where("date", ">=", initialDate),
        where("date", "<=", finalDate)
      );

      const expensesSnapshot = await getDocs(expensesQuery);

      if (expensesSnapshot.size === 0) {
        return Promise.reject("empty");
      }

      let total = 0;
      expensesSnapshot.forEach((expense) => {
        const { segment } = expense.data();
        switch (segment) {
          case "Necessidades":
            needs++;
            break;

          case "Investimentos":
            invest++;
            break;

          case "Lazer":
            leisure++;
            break;

          case "Educação":
            education++;
            break;

          case "Curto e médio prazo":
            shortAndMediumTime++;
            break;
        }

        total++;
      });

      needs = (needs / total) * 100;
      invest = (invest / total) * 100;
      leisure = (leisure / total) * 100;
      education = (education / total) * 100;
      shortAndMediumTime = (shortAndMediumTime / total) * 100;

      const finalData = defaultData;
      finalData[0].value = leisure;
      finalData[1].value = invest;
      finalData[2].value = education;
      finalData[3].value = shortAndMediumTime;
      finalData[4].value = needs;

      return Promise.resolve(finalData);
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
