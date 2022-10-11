import * as React from "react";
import { LogBox } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import * as Font from "expo-font";

import AppContent from "./src/screens/App";
import { UserContextProvider } from "./src/context/User/userContext";
import { ConfirmContextProvider } from "./src/context/ConfirmDialog/confirmContext";
import { LoaderContextProvider } from "./src/context/Loader/loaderContext";
import { DataContextProvider } from "./src/context/Data/dataContext";
import BaseProvider from "./src/styles/baseTheme";
import { ThemeContextProvider } from "./src/context/Theme/themeContext";

LogBox.ignoreAllLogs(true);

const customFonts = {
  Montserrat_500Medium: require("./assets/fonts/Montserrat-Medium.ttf"),
  Montserrat_700Bold: require("./assets/fonts/Montserrat-Bold.ttf"),
  Montserrat_800ExtraBold: require("./assets/fonts/Montserrat-ExtraBold.ttf"),
  Raleway_500Medium: require("./assets/fonts/Raleway-Medium.ttf"),
  Raleway_700Bold: require("./assets/fonts/Raleway-Bold.ttf"),
  Raleway_800ExtraBold: require("./assets/fonts/Raleway-ExtraBold.ttf"),
};

SplashScreen.preventAutoHideAsync();

const App = () => {
  const [fontLoaded, setFontLoaded] = React.useState(false);

  React.useEffect(() => {
    (async () => {
      try {
        await Font.loadAsync(customFonts);
      } catch (e) {
        console.warn(e);
      } finally {
        setFontLoaded(true);
      }
    })();
  }, []);

  React.useEffect(() => {
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
