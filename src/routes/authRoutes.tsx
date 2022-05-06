import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Index from "../screens/Index";
import Login from "../screens/Login";
import Register from "../screens/Register";
import ForgotPassword from "../screens/ForgotPassword";
import { SafeAreaContainer } from "../styles/general";

const Stack = createNativeStackNavigator();
export default function AuthRoutes() {
  return (
    <NavigationContainer>
      <SafeAreaContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Index"
            component={Index}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Login"
            component={Login}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Register"
            component={Register}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Forgot"
            component={ForgotPassword}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </SafeAreaContainer>
    </NavigationContainer>
  );
}
