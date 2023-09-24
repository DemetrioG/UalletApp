import { doc, getDoc } from "firebase/firestore";
import { authUser } from "../../../utils/query.helper";
import { db } from "../../../services/firebase";
import { API_URL } from "@env";

export async function getPrice() {
  const user = await authUser();
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
  return Number(price) / 100;
}

export async function sendPaymentIntent() {
  const user = await authUser();
  if (!user) return Promise.reject();

  const customerSnapshot = await getDoc(doc(db, "customers", user.uid));
  const stripeId = customerSnapshot.data()?.stripeId;

  const response = await fetch(`${API_URL.toString()}/createPaymentIntent`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      customer: stripeId,
    }),
  });

  const { url } = await response.json();
  return url;
}
