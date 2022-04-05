import React, { useEffect, useState } from "react";
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

const store = createStore(Reducers);
LogBox.ignoreAllLogs(true);

interface IThemeProvider {
  default: Object;
}

export default function App(): JSX.Element {
  const [theme, setTheme] = useState<IThemeProvider>();
  const [fontLoaded] = useFonts({
    Raleway_500Medium,
    Raleway_700Bold,
    Raleway_800ExtraBold,
    Montserrat_500Medium,
    Montserrat_700Bold,
    Montserrat_800ExtraBold,
  });

  useEffect(() => {
    setTheme(
      Appearance.getColorScheme() == "light"
        ? { default: LIGHT }
        : { default: DARK }
    );
  }, []);

  Appearance.addChangeListener(() => {
    setTheme(
      Appearance.getColorScheme() == "light"
        ? { default: LIGHT }
        : { default: DARK }
    );
  });

  if (!fontLoaded) {
    return <AppLoading />;
  } else {
    return (
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <AppContent />
        </ThemeProvider>
      </Provider>
    );
  }
}
