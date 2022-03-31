import React from "react";
import { LogBox } from "react-native";
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
import { createStore } from "redux";
import { Provider } from "react-redux";
import AppLoading from "expo-app-loading";

import Reducers from "./src/components/Reducers";
import AppContent from "./src/pages/App";

const store = createStore(Reducers);

LogBox.ignoreAllLogs(true);

export default function App() {
  const [fontLoaded] = useFonts({
    Raleway_500Medium,
    Raleway_700Bold,
    Raleway_800ExtraBold,
    Montserrat_500Medium,
    Montserrat_700Bold,
    Montserrat_800ExtraBold,
  });

  if (!fontLoaded) {
    return <AppLoading />;
  } else {
    return (
      <Provider store={store}>
        <AppContent />
      </Provider>
    );
  }
}
