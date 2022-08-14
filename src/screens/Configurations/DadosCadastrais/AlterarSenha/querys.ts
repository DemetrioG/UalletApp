import firebase from "firebase";

const reautenticate = async (password: string, user: firebase.User) => {
  try {
    const { email } = user;
  
    if (!email) return false;

    return firebase.auth().signInWithEmailAndPassword(email, password);

  } catch {
    return false;
  }
}

type changePasswordParams = {
  oldPassword: string,
  newPassword: string
}

export const changePassword = async ({ oldPassword, newPassword }: changePasswordParams) => {
  try {
    const user = firebase.auth().currentUser;

    if (!user) return false;
    
    const matchOldPassword = await reautenticate(oldPassword, user);
    if (!matchOldPassword) return false;
  
    user?.updatePassword(newPassword);
    return true;
  } catch {
    return false;
  }
}