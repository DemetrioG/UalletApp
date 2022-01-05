import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Index from '../pages/Index';
import Login from '../pages/Login';
import Register from '../pages/Register';

const Stack = createNativeStackNavigator();

export default function routes() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Index" component={Index} options={{headerShown: false}}/>
            <Stack.Screen name="Login" component={Login} options={{headerShown: false}}/>
            <Stack.Screen name="Register" component={Register} options={{headerShown: false}}/>
        </Stack.Navigator>
    );
}