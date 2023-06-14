import firebase from "@services/firebase";
import { currentUser } from "../../utils/query.helper";

async function _refreshAuthDevice(expoPushToken: string) {
  const user = await currentUser();

  if (!user) return Promise.reject();

  await firebase
    .firestore()
    .collection("users")
    .doc(user.uid)
    .get()
    .then((v) => {
      const data = v.data()?.devices || [];

      const [anotherDevices] = data.filter(
        ({ token }: { token: string }) => token !== expoPushToken
      );
      const [currentDevice] = data.filter(
        ({ token }: { token: string }) => token === expoPushToken
      );

      if (currentDevice) {
        currentDevice["logged"] = false;
      }

      const updatedData = anotherDevices
        ? [anotherDevices, currentDevice]
        : [currentDevice];

      firebase.firestore().collection("users").doc(user?.uid).set(
        {
          devices: updatedData,
        },
        { merge: true }
      );
    });
}

export function refreshAuthDevice(expoPushToken: string) {
  try {
    return _refreshAuthDevice(expoPushToken);
  } catch (error) {
    console.log(error);
    throw new Error("Erro");
  }
}
