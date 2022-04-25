import * as React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { AlertContext } from "../../context/Alert/alertContext";
import Entry from "../Entry";
import NewEntry from "../NewEntry";
import Alert from "../../components/Alert";
import Header from "../../components/Header";
import { BackgroundContainer, ViewTab } from "../../styles/generalStyled";

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
        </Stack.Navigator>
      </ViewTab>
    </BackgroundContainer>
  );
}
