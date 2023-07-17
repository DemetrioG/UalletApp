import {
  User,
  getAuth,
  signInWithEmailAndPassword,
  updatePassword,
} from "firebase/auth";

const reautenticate = async (password: string, user: User) => {
  try {
    const { email } = user;
    if (!email) return false;

    const auth = getAuth();
    return signInWithEmailAndPassword(auth, email, password);
  } catch {
    return false;
  }
};

type changePasswordParams = {
  oldPassword: string;
  newPassword: string;
};

export const changePassword = async ({
  oldPassword,
  newPassword,
}: changePasswordParams) => {
  const auth = getAuth();
  const user = auth.currentUser;
  if (!user) return false;

  try {
    await reautenticate(oldPassword, user);
    await updatePassword(user, newPassword);
  } catch {
    return false;
  }
};
