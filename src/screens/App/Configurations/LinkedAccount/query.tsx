import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { SharedAccount, ValidatedLinkedAccountDTO } from "./types";
import { db } from "../../../../services/firebase";
import { currentUser } from "../../../../utils/query.helper";
import { UserInfo } from "../DadosCadastrais/InformacoesPessoais/types";

export async function listLinkedAccountsWhenYouShareData() {
  const user = await currentUser();
  if (!user) return Promise.reject();

  const conditional = [
    {
      linked: false,
      uid: user.uid,
    },
    {
      linked: true,
      uid: user.uid,
    },
  ];

  const snapshot = await getDocs(
    query(
      collection(db, "users"),
      where("sharedAccounts", "array-contains-any", conditional)
    )
  );

  return snapshot.docs.map((doc) => doc.data()) as UserInfo[];
}

export async function listLinkedAccountsSharedWithYou() {
  const user = await currentUser();
  if (!user) return Promise.reject();

  const snapshotUser = await getDoc(doc(db, "users", user.uid));
  const data = snapshotUser.data();
  const sharedAccounts = data?.shared_accounts as SharedAccount[];

  const list: UserInfo[] = [];

  if (sharedAccounts) {
    await Promise.all(
      sharedAccounts?.map(async (account) => {
        const snapshotSharedAccount = await getDoc(
          doc(db, "users", account.uid)
        );
        const data = snapshotSharedAccount.data() as UserInfo;
        list.push(data);
      })
    );
  }

  return list;
}

export async function createLinkedAccount(formData: ValidatedLinkedAccountDTO) {
  const user = await currentUser();
  if (!user) return Promise.reject();

  const snapshot = await getDocs(
    query(collection(db, "users"), where("email", "==", formData.email))
  );

  const [doc] = snapshot.docs;
  if (!doc) return Promise.reject("Usuário não encontrado");

  const data = doc.data();
  console.log(data);

  if (data.shared_accounts) {
    data.shared_accounts = [
      ...data.shared_accounts,
      { uid: user.uid, linked: false },
    ];
  } else {
    data.shared_accounts = [{ uid: user.uid, linked: false }];
  }

  return await setDoc(doc.ref, data);
}

export async function checkIfEmailExist(email: string) {
  const user = await currentUser();
  if (!user) return Promise.reject();

  const userRef = collection(db, "users");
  const userSnapshot = await getDocs(
    query(userRef, where("email", "==", email))
  );

  return !(userSnapshot.docs.length > 0);
}
