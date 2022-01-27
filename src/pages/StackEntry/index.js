import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Entry from '../Entry';

const Stack = createNativeStackNavigator();

export default function StackEntry() {

    return (
        <Stack.Navigator>
            <Stack.Screen name="Lançamentos" component={Entry} options={{headerShown: false}}/>
        </Stack.Navigator>
    );
}