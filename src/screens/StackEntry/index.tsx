import * as React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { AlertContext } from "../../context/Alert/alertContext";
import Entry from "../Entry";
import NewEntry from "../NewEntry";
import FixedEntry from "../FixedEntry";
import Alert from "../../components/Alert";
import Header from "../../components/Header";
import { BackgroundContainer, ViewTab } from "../../styles/general";

const Stack = createNativeStackNavigator();

export default function StackEntry() {
  const { alert, setAlert } = React.useContext(AlertContext);

  return (
    <BackgroundContainer>
      {alert.visibility && <Alert />}
      <Header />
      <ViewTab>
        <Stack.Navigator>
          <Stack.Screen
            name="Lançamentos"
            component={Entry}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="NovoLançamento"
            component={NewEntry}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="LançamentoFixo"
            component={FixedEntry}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </ViewTab>
    </BackgroundContainer>
  );
}
