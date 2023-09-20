import { collection, getDocs, query, where } from "firebase/firestore";
import { BalanceProps } from "../../context/Data/dataContext";
import { currentUser } from "../../utils/query.helper";
import { db } from "../../services/firebase";
import { BalanceCardsProps } from "./types";
import { filter, sortBy } from "lodash";

export async function getAccountRefs(balance: BalanceProps) {
  const user = await currentUser();
  if (!user) return Promise.reject();

  const accountRefs = await Promise.all(
    Object.entries(balance).map(async ([key, value]) => {
      if (key === "total") {
        return { name: "Total das contas", value, color: "#266DD3" };
      } else {
        const accountRef = await getDocs(
          query(
            collection(db, "accounts", user.uid, "accounts"),
            where("value", "==", key)
          )
        );
        const [data] = accountRef.docs.map((doc) => doc.data());
        return {
          name: data.name,
          value: balance?.[key].balance ?? 0,
          color: data.color,
        };
      }
    })
  );

  return sortBy(accountRefs, (item) => {
    if (item.name === "Total das contas") return 0;
    return 1;
  }) as BalanceCardsProps[];
}
