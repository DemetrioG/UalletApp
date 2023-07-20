import { db, auth } from "../../../services/firebase";
import { convertDate, convertDateToDatabase } from "../../../utils/date.helper";
import * as Device from "expo-device";
import { TLoggedSucceed, TLoginByEmailAndPassword } from "./types";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

export const loginByEmailAndPassword = async (
  props: TLoginByEmailAndPassword
): Promise<TLoggedSucceed> => {
  const { email, password, expoPushToken } = props;

  /* 15 Dias para expirar o token */
  const expirationAuthDate = new Date(Date.now() + 15 * 24 * 60 * 60 * 1000);

  try {
    const { user } = await signInWithEmailAndPassword(auth, email, password);

    if (Device.isDevice) {
      const userDocRef = doc(db, "users", user?.uid);
      const userDocSnapshot = await getDoc(userDocRef);
      const data = userDocSnapshot.data()?.devices || [];

      const atualDeviceData = {
        token: expoPushToken,
        logged: true,
        expirationDate: convertDateToDatabase(convertDate(expirationAuthDate)),
      };

      const [anotherDevices] = data.filter(
        ({ token }: { token: string }) => token !== expoPushToken
      );
      const [currentDevice] = data.filter(
        ({ token }: { token: string }) => token === expoPushToken
      );

      if (currentDevice) {
        currentDevice.logged = atualDeviceData.logged;
        currentDevice.expirationDate = atualDeviceData.expirationDate;
      }

      const atualDevice = currentDevice ? currentDevice : atualDeviceData;
      const updatedData = anotherDevices
        ? [anotherDevices, atualDevice]
        : [atualDevice];

      await setDoc(
        doc(db, "users", user?.uid),
        {
          devices: updatedData,
        },
        { merge: true }
      );
    }

    return Promise.resolve({
      uid: user?.uid as string,
      date: expirationAuthDate,
    });
  } catch (error) {
    return Promise.reject("Usuário e senha inválidos");
  }
};
