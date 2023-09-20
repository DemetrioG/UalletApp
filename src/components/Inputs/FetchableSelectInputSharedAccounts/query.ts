import { doc, getDoc } from "firebase/firestore";
import { listLinkedAccountsSharedWithYou } from "../../../screens/App/Configurations/LinkedAccount/query";
import { db } from "../../../services/firebase";
import { currentUser } from "../../../utils/query.helper";
import { ListLinkedAccount } from "../../../screens/App/Configurations/LinkedAccount/types";

export async function listAccounts() {
  const user = await currentUser(true);
  if (!user) return Promise.reject();

  const data = await listLinkedAccountsSharedWithYou();
  const snapshotUser = await getDoc(doc(db, "users", user.uid));
  const userData = snapshotUser.data();
  data.push({
    ...userData,
    uid: snapshotUser.ref.id,
    name: `${userData?.name} (Você)`,
  } as ListLinkedAccount);

  return data.map((account) => {
    return {
      value: account.uid,
      label: account.name,
    };
  });
}
