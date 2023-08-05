import { doc, getDoc, updateDoc } from "firebase/firestore";
import { currentUser } from "../../utils/query.helper";
import { db } from "../../services/firebase";

export async function refreshAuthDevice(expoPushToken: string) {
  const user = await currentUser();
  if (!user) return Promise.reject();

  const userRef = doc(db, "users", user.uid);

  try {
    const userSnapshot = await getDoc(userRef);
    const data = userSnapshot.data()?.devices || [];

    const [anotherDevices] = data.filter(
      ({ token }: { token: string }) => token !== expoPushToken
    );
    const [currentDevice] = data.filter(
      ({ token }: { token: string }) => token === expoPushToken
    );

    if (currentDevice) {
      currentDevice.logged = false;
    }

    const updatedData = !!anotherDevices.length
      ? [anotherDevices, currentDevice]
      : [currentDevice];

    await updateDoc(userRef, {
      devices: updatedData,
    });
  } catch (error) {
    return Promise.reject(error);
  }

  return Promise.resolve();
}
