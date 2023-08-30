import { useEffect } from "react";
import { LogBox } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";
import { initStripe } from "@stripe/stripe-react-native";
import { STRIPE_PUBLISHABLE_KEY } from "@env";

import { App as AppContent } from "./src/screens";
import { UserContextProvider } from "./src/context/User/userContext";
import { ConfirmContextProvider } from "./src/context/ConfirmDialog/confirmContext";
import { DataContextProvider } from "./src/context/Data/dataContext";
import BaseProvider from "./src/styles/baseTheme";
import { ThemeContextProvider } from "./src/context/Theme/themeContext";

LogBox.ignoreAllLogs(true);
SplashScreen.preventAutoHideAsync();

const App = () => {
  const [fontLoaded] = useFonts(customFonts);

  useEffect(() => {
    (async () => {
      if (fontLoaded) {
        await SplashScreen.hideAsync();
      }
    })();
  }, [fontLoaded]);

  useEffect(() => {
    initStripe({
      publishableKey: STRIPE_PUBLISHABLE_KEY.toString(),
      merchantIdentifier: "merchant.identifier",
    });
  }, []);

  if (!fontLoaded) {
    return null;
  }

  return (
    <ThemeContextProvider>
      <BaseProvider>
        <UserContextProvider>
          <DataContextProvider>
            <ConfirmContextProvider>
              <AppContent />
            </ConfirmContextProvider>
          </DataContextProvider>
        </UserContextProvider>
      </BaseProvider>
    </ThemeContextProvider>
  );
};
export default App;

const customFonts = {
  "Montserrat-Regular": require("./assets/fonts/Montserrat-Regular.ttf"),
  "Montserrat-Medium": require("./assets/fonts/Montserrat-Medium.ttf"),
  "Montserrat-SemiBold": require("./assets/fonts/Montserrat-SemiBold.ttf"),
  "Montserrat-Bold": require("./assets/fonts/Montserrat-Bold.ttf"),
  "Montserrat-ExtraBold": require("./assets/fonts/Montserrat-ExtraBold.ttf"),
};
