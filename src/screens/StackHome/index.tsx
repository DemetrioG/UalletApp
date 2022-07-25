import * as React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Home from "../Home";
import Complete from "../Complete";

const Stack = createNativeStackNavigator();

const StackHome = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={Home}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Complete"
        component={Complete}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default StackHome;
