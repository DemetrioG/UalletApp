import React, { useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Appearance } from 'react-native';
import { connect } from 'react-redux';

import Index from '../pages/Index';
import Login from '../pages/Login';
import Register from '../pages/Register';
import ForgotPassword from '../pages/ForgotPassword';
import Home from '../pages/Home';
import { editTheme } from '../components/Actions/themeAction';

const Stack = createNativeStackNavigator();

export function routes(props) {

    useEffect(() => {
        props.editTheme(Appearance.getColorScheme());
    });

    Appearance.addChangeListener(() => {
        props.editTheme(Appearance.getColorScheme());
    })

    return (
        <Stack.Navigator>
            <Stack.Screen name="Index" component={Index} options={{headerShown: false}}/>
            <Stack.Screen name="Login" component={Login} options={{headerShown: false}}/>
            <Stack.Screen name="Register" component={Register} options={{headerShown: false}}/>
            <Stack.Screen name="Home" component={Home} options={{headerShown: false}}/>
            <Stack.Screen name="Forgot" component={ForgotPassword} options={{headerShown: false}}/>
        </Stack.Navigator>
    );
};

const mapStateToProps = (state) => {
    return {
        theme: state.theme.theme,
    }
  }
  
const routesConnect = connect(mapStateToProps, { editTheme })(routes);

export default routesConnect;
  