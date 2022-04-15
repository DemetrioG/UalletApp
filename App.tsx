import * as React from "react";
import { LogBox, Appearance } from "react-native";
import { createStore } from "redux";
import { Provider } from "react-redux";
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

import Reducers from "./src/components/Reducers";
import AppContent from "./src/pages/App";
import { LIGHT, DARK } from "./src/styles/theme";
import { UserContextProvider } from "./src/context/User/userContext";
import { AlertContextProvider } from "./src/context/Alert/alertContext";

const store = createStore(Reducers);
LogBox.ignoreAllLogs(true);

interface IThemeProvider {
  theme: Object;
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
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <UserContextProvider>
            <AlertContextProvider>
              <AppContent />
            </AlertContextProvider>
          </UserContextProvider>
        </ThemeProvider>
      </Provider>
    );
  }
}
