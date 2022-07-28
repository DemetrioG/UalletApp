import * as React from "react";
import { LogBox, Appearance } from "react-native";
import { ThemeProvider } from "styled-components";
import * as SplashScreen from "expo-splash-screen";
import * as Font from "expo-font";

import AppContent from "./src/screens/App";
import { LIGHT, DARK } from "./src/styles/theme";
import { UserContextProvider } from "./src/context/User/userContext";
import { AlertContextProvider } from "./src/context/Alert/alertContext";
import { LoaderContextProvider } from "./src/context/Loader/loaderContext";
import { DataContextProvider } from "./src/context/Data/dataContext";
import BaseProvider from "./src/styles/baseTheme";

LogBox.ignoreAllLogs(true);

export interface IThemeProvider {
  theme?: typeof LIGHT;
}

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
  const [theme, setTheme] = React.useState<IThemeProvider>();
  const [fontLoaded, setFontLoaded] = React.useState(false);

  function setDefaultTheme(theme: string) {
    setTheme(theme == "dark" ? { theme: DARK } : { theme: LIGHT });
  }

  React.useEffect(() => {
    setDefaultTheme(Appearance.getColorScheme() || "light");
    Appearance.addChangeListener((preference) =>
      setDefaultTheme(preference.colorScheme || "light")
    );
  }, []);

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
    <BaseProvider>
      <ThemeProvider theme={theme}>
        <UserContextProvider>
          <DataContextProvider>
            <AlertContextProvider>
              <LoaderContextProvider>
                <AppContent />
              </LoaderContextProvider>
            </AlertContextProvider>
          </DataContextProvider>
        </UserContextProvider>
      </ThemeProvider>
    </BaseProvider>
  );
};
export default App;
