import {
  EmailAuthProvider,
  deleteUser,
  reauthenticateWithCredential,
} from "firebase/auth";
import { authUser } from "../../../../../utils/query.helper";

export async function deleteAccount(password: string) {
  const user = await authUser();
  if (!user) return Promise.reject(false);
  const credential = EmailAuthProvider.credential(user?.email, password);

  await reauthenticateWithCredential(user, credential);
  await deleteUser(user);
  return Promise.resolve("Success");
}
