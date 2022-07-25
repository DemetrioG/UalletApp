import * as React from "react";
import { LogBox, Appearance } from "react-native";
import { ThemeProvider } from "styled-components";
import AppLoading from "expo-app-loading";
import { useFonts } from "expo-font";
import {
  Montserrat_500Medium,
  Montserrat_700Bold,
  Montserrat_800ExtraBold,
} from "@expo-google-fonts/montserrat";
import {
  Raleway_500Medium,
  Raleway_700Bold,
  Raleway_800ExtraBold,
} from "@expo-google-fonts/raleway";

import AppContent from "./src/screens/App";
import { LIGHT, DARK } from "./src/styles/theme";
import { UserContextProvider } from "./src/context/User/userContext";
import { AlertContextProvider } from "./src/context/Alert/alertContext";
import { DateContextProvider } from "./src/context/Date/dateContext";
import { LoaderContextProvider } from "./src/context/Loader/loaderContext";
import { DataContextProvider } from "./src/context/Data/dataContext";
import BaseProvider from "./src/styles/baseTheme";

LogBox.ignoreAllLogs(true);

export interface IThemeProvider {
  theme?: typeof LIGHT;
}

const App = () => {
  const [theme, setTheme] = React.useState<IThemeProvider>();
  const [fontLoaded] = useFonts({
    Raleway_500Medium,
    Raleway_700Bold,
    Raleway_800ExtraBold,
    Montserrat_500Medium,
    Montserrat_700Bold,
    Montserrat_800ExtraBold,
  });

  function setDefaultTheme(theme: string) {
    setTheme(theme == "dark" ? { theme: DARK } : { theme: LIGHT });
  }

  React.useEffect(() => {
    setDefaultTheme(Appearance.getColorScheme() || "light");
    Appearance.addChangeListener((preference) =>
      setDefaultTheme(preference.colorScheme || "light")
    );
  }, []);

  if (!fontLoaded) {
    return <AppLoading />;
  } else {
    return (
      <BaseProvider>
        <ThemeProvider theme={theme}>
          <UserContextProvider>
            <DateContextProvider>
              <DataContextProvider>
                <AlertContextProvider>
                  <LoaderContextProvider>
                    <AppContent />
                  </LoaderContextProvider>
                </AlertContextProvider>
              </DataContextProvider>
            </DateContextProvider>
          </UserContextProvider>
        </ThemeProvider>
      </BaseProvider>
    );
  }
};

export default App;
