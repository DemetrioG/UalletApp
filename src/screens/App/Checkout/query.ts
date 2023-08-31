import { doc, getDoc } from "firebase/firestore";
import { currentUser } from "../../../utils/query.helper";
import { db } from "../../../services/firebase";

export async function getPrice() {
  const user = await currentUser();
  if (!user) return Promise.reject();

  const priceSnapshot = await getDoc(
    doc(
      db,
      "products",
      "prod_OXhkGS3Q6Q9rOI",
      "prices",
      "price_1NkcKfC00nlg0ZfA9EgBKzl8"
    )
  );

  const price = priceSnapshot.data()?.unit_amount ?? 0;
  const formattedValue = Number(price) / 100;

  return formattedValue.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}
