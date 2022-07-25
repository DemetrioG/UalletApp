import * as React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Entry from "../Entry";
import NewEntry from "../NewEntry";
import Filter from "../Entry/Filter";
import FixedEntry from "../FixedEntry";
import Alert from "../../components/Alert";
import Header from "../../components/Header";
import { BackgroundContainer, ViewTab } from "../../styles/general";

const Stack = createNativeStackNavigator();

const StackEntry = () => {
  return (
    <BackgroundContainer>
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
          <Stack.Screen
            name="Filtros"
            component={Filter}
            options={{ headerShown: false, presentation: "transparentModal" }}
          />
        </Stack.Navigator>
      </ViewTab>
    </BackgroundContainer>
  );
};

export default StackEntry;
