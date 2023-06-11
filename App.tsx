import { useEffect } from "react";
import { LogBox } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";

import { App as AppContent } from "./src/screens";
import { UserContextProvider } from "@context/User/userContext";
import { ConfirmContextProvider } from "@context/ConfirmDialog/confirmContext";
import { LoaderContextProvider } from "@context/Loader/loaderContext";
import { DataContextProvider } from "@context/Data/dataContext";
import BaseProvider from "@styles/baseTheme";
import { ThemeContextProvider } from "@context/Theme/themeContext";

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

  if (!fontLoaded) {
    return null;
  }

  return (
    <ThemeContextProvider>
      <BaseProvider>
        <UserContextProvider>
          <DataContextProvider>
            <ConfirmContextProvider>
              <LoaderContextProvider>
                <AppContent />
              </LoaderContextProvider>
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
