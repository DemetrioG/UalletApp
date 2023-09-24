import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import {
  ListLinkedAccount,
  SharedAccount,
  ValidatedLinkedAccountDTO,
} from "./types";
import { db } from "../../../../services/firebase";
import { authUser, currentUser } from "../../../../utils/query.helper";
import { UserInfo } from "../DadosCadastrais/InformacoesPessoais/types";

export async function listLinkedAccountsWhenYouShareData() {
  const user = await authUser();
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

  return snapshot.docs.map((doc) => {
    return { ...doc.data(), uid: doc.ref.id };
  }) as ListLinkedAccount[];
}

export async function listLinkedAccountsSharedWithYou() {
  const user = await authUser();
  if (!user) return Promise.reject();

  const snapshotUser = await getDoc(doc(db, "users", user.uid));
  const data = snapshotUser.data();
  const sharedAccounts = data?.sharedAccounts as SharedAccount[];

  const list: ListLinkedAccount[] = [];

  if (sharedAccounts) {
    await Promise.all(
      sharedAccounts?.map(async (account) => {
        const snapshotSharedAccount = await getDoc(
          doc(db, "users", account.uid)
        );
        const data = {
          ...snapshotSharedAccount.data(),
          uid: snapshotSharedAccount.ref.id,
        } as ListLinkedAccount;
        list.push(data);
      })
    );
  }

  return list;
}

export async function createLinkedAccount(formData: ValidatedLinkedAccountDTO) {
  const user = await authUser();
  if (!user) return Promise.reject();

  const snapshot = await getDocs(
    query(collection(db, "users"), where("email", "==", formData.email))
  );

  const [doc] = snapshot.docs;
  if (!doc) return Promise.reject("Usuário não encontrado");

  const data = doc.data();

  if (data.sharedAccounts) {
    data.sharedAccounts = [
      ...data.sharedAccounts,
      { uid: user.uid, linked: false },
    ];
  } else {
    data.sharedAccounts = [{ uid: user.uid, linked: false }];
  }

  return await setDoc(doc.ref, data);
}

export async function deleteLinkedAccount(formData: ListLinkedAccount) {
  const user = await authUser();
  if (!user) return Promise.reject();

  const userRef = doc(db, "users", formData.uid);
  const userSnapshot = await getDoc(userRef);
  const userData = userSnapshot.data() as UserInfo;
  const sharedAccounts = userData.sharedAccounts.filter(
    (item) => item.uid !== user.uid
  );
  return await setDoc(userRef, { ...userData, sharedAccounts });
}

export async function checkIfEmailExist(email: string) {
  const user = await authUser();
  if (!user) return Promise.reject();

  const userRef = collection(db, "users");
  const userSnapshot = await getDocs(
    query(userRef, where("email", "==", email))
  );

  return !(userSnapshot.docs.length > 0);
}
