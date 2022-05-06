import * as React from "react";
import { LogBox, Appearance } from "react-native";
import { ThemeProvider } from "styled-components";
import AppLoading from "expo-app-loading";
import {
  Montserrat_500Medium,
  Montserrat_700Bold,
  Montserrat_800ExtraBold,
} from "@expo-google-fonts/montserrat";
import {
  useFonts,
  Raleway_500Medium,
  Raleway_700Bold,
  Raleway_800ExtraBold,
} from "@expo-google-fonts/raleway";

import AppContent from "./src/screens/App";
import { LIGHT, DARK } from "./src/styles/theme";
import { UserContextProvider } from "./src/context/User/userContext";
import { AlertContextProvider } from "./src/context/Alert/alertContext";
import { DateContextProvider } from "./src/context/Date/dateContext";

LogBox.ignoreAllLogs(true);

export interface IThemeProvider {
  theme?: typeof LIGHT;
}

export default function App(): JSX.Element {
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
      <ThemeProvider theme={theme}>
        <UserContextProvider>
          <DateContextProvider>
            <AlertContextProvider>
              <AppContent />
            </AlertContextProvider>
          </DateContextProvider>
        </UserContextProvider>
      </ThemeProvider>
    );
  }
}
