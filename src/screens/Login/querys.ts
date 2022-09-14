import firebase from "../../services/firebase";
import { convertDate, convertDateToDatabase } from "../../utils/date.helper";
//import * as AuthSession from "expo-auth-session";
//import * as Facebook from "expo-facebook";

type TLoginByEmailAndPassword = {
  email: string;
  password: string;
  expoPushToken: string;
};
type TLoggedSucceed = { uid: string; date: Date };

export const loginByEmailAndPassword = async (
  props: TLoginByEmailAndPassword
): Promise<TLoggedSucceed> => {
  const { email, password, expoPushToken } = props;
  const expirationAuthDate = new Date(Date.now() + 15 * 24 * 60 * 60 * 1000);
  try {
    const { user } = await firebase
      .auth()
      .signInWithEmailAndPassword(email, password);

    await firebase
      .firestore()
      .collection("users")
      .doc(user?.uid)
      .get()
      .then((v) => {
        const data = v.data()?.devices || [];
        const atualDeviceData = {
          token: expoPushToken,
          logged: true,
          expirationDate: convertDateToDatabase(
            convertDate(expirationAuthDate)
          ),
        };
        const [anotherDevices] = data.filter(
          ({ token }: { token: string }) => token !== expoPushToken
        );
        const [currentDevice] = data.filter(
          ({ token }: { token: string }) => token === expoPushToken
        );

        if (currentDevice) {
          currentDevice["logged"] = atualDeviceData.logged;
          currentDevice["expirationDate"] = atualDeviceData.expirationDate;
        }

        const atualDevice = currentDevice ? currentDevice : atualDeviceData;
        const updatedData = anotherDevices
          ? [anotherDevices, atualDevice]
          : [atualDevice];

        firebase.firestore().collection("users").doc(user?.uid).set(
          {
            devices: updatedData,
          },
          { merge: true }
        );
      });

    return Promise.resolve({
      uid: user?.uid as string,
      // Salva no storage a data atual + 15 dias, para deixar o usuário
      // autenticado sem precisar logar em toda entrada do app.
      date: expirationAuthDate,
    });
  } catch {
    return Promise.reject("Usuário e senha ");
  }
};

export const loginByGoogle = async () => {
  throw new Error("Método não implementado");
  /**
   * if (networkConnection(isNetworkConnected!, setAlert)) {
      setLoading(true);
      const CLIENT_ID =
        "1027938913805-2uq44iec7nrr8p5c9qqu32nbapu5gfg6.apps.googleusercontent.com";
      const REDIRECT_URI = "https://auth.expo.io/@demetriog/Uallet";
      const RESPONSE_TYPE = "token";
      const SCOPE = encodeURI("profile email");

      const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPE}`;

      // Autenticação com o Google
      const response = await AuthSession.startAsync({ authUrl });

      if (response.type === "success") {
        // Buscar informações do usuário
        const user = await fetch(
          `https://www.googleapis.com/oauth2/v2/userinfo?alt=json&access_token=${response.params.access_token}`
        );
        const userInfo = await user.json();

        // Cadastrar usuário no banco
        await firebase
          .firestore()
          .collection("users")
          .doc(userInfo.id)
          .get()
          .then((v) => {
            if (!v.data()) {
              firebase.firestore().collection("users").doc(userInfo.id).set({
                name: userInfo.name,
                email: userInfo.email,
                typeUser: "google",
                dateRegister: firebase.firestore.FieldValue.serverTimestamp(),
              });
            }
          });

        const data = {
          uid: userInfo.id,
          // Salva no storage a data atual + 15 dias, para deixar o usuário autenticado sem precisar logar em toda entrada do app
          date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
        };
        setStorage("authUser", data);
        setUser((userState) => ({
          ...userState,
          uid: userInfo.id,
          signed: true,
        }));
      }
      return setLoading(false);
    }
   */
};

export const loginByFacebook = async () => {
  throw new Error("Método não implementado");
  /**
   * if (networkConnection(isNetworkConnected!, setAlert)) {
      setLoading(true);
      // Autenticação com o Facebook
      await Facebook.initializeAsync("623678532217571");

      const response = await Facebook.logInWithReadPermissionsAsync({
        permissions: ["public_profile", "email"],
      });

      // Buscar informações do usuário
      if (response.type === "success") {
        const data = await fetch(
          `https://graph.facebook.com/me?fields=id,name,picture.type(large),email&access_token=${response.token}`
        );

        const userInfo = await data.json();

        // Cadastrar usuário no banco
        await firebase
          .firestore()
          .collection("users")
          .doc(userInfo.id)
          .get()
          .then((v) => {
            if (!v.data()) {
              firebase.firestore().collection("users").doc(userInfo.id).set({
                name: userInfo.name,
                email: userInfo.email,
                typeUser: "facebook",
                dateRegister: firebase.firestore.FieldValue.serverTimestamp(),
              });
            }
          });

        const dataStorage = {
          uid: userInfo.id,
          // Salva no storage a data atual + 15 dias, para deixar o usuário autenticado sem precisar logar em toda entrada do app
          date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
        };
        setStorage("authUser", dataStorage);
        setUser((userState) => ({
          ...userState,
          uid: userInfo.id,
          signed: true,
        }));
        return setLoading(false);
      }
    }
   */
};
