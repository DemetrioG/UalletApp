import { collection, getDocs } from "firebase/firestore";
import { currentUser } from "../../../utils/query.helper";
import { db } from "../../../services/firebase";
import { format } from "date-fns";
import _, { capitalize } from "lodash";
import { ptBR } from "date-fns/locale";

export async function listPeriodsToReproduce() {
  const user = await currentUser();
  if (!user) return Promise.reject();

  const docs = await getDocs(collection(db, "entry", user.uid, "Projetado"));
  const data = docs.docs.map((doc) => doc.data().date);

  const distinctMonthYears = _(data)
    .map((obj) => format(new Date(obj.seconds * 1000), "MM/yyyy"))
    .groupBy()
    .map((values, key) => {
      const [month, year] = key.split("/");
      const date = new Date(parseInt(year), parseInt(month) - 1, 1);
      const formattedMonth = capitalize(format(date, "MMM", { locale: ptBR }));
      const formattedYear = format(date, "yyyy");
      return {
        value: key,
        label: `${formattedMonth} ${formattedYear}`,
        count: values.length,
      };
    })
    .sortBy("value")
    .value();

  return distinctMonthYears;
}
