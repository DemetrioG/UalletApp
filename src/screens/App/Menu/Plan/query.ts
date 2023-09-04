import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { currentUser } from "../../../../utils/query.helper";
import { db } from "../../../../services/firebase";

export async function getPlans() {
  const user = await currentUser();
  if (!user) return Promise.reject();

  const [subscription, userData] = await Promise.all([
    getDocs(collection(db, "customers", user.uid, "subscriptions")),
    getDoc(doc(db, "users", user.uid)),
  ]);

  const freePlanData = [
    {
      status: "active",
      current_period_end: userData.data()?.expirationDate,
      items: [
        {
          price: {
            product: {
              name: "Plano free",
            },
          },
          plan: {
            amount: 0,
          },
        },
      ],
    },
  ];

  return !!subscription.size
    ? subscription.docs?.map((doc) => doc.data())
    : freePlanData;
}
