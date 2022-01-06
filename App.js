import { Montserrat_500Medium, Montserrat_700Bold, Montserrat_800ExtraBold } from '@expo-google-fonts/montserrat';
import { useFonts, Raleway_500Medium, Raleway_700Bold, Raleway_800ExtraBold } from "@expo-google-fonts/raleway";
import { Image, StatusBar, Appearance, Platform, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import SafeAreaView from 'react-native-safe-area-view';
import { general, colors } from './src/styles';
import React, { useState } from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import Routes from './src/routes';
import Reducers from './src/components/Reducers';

let store = createStore(Reducers);

export default function App() {

  let [fontLoaded] = useFonts ({
    Raleway_500Medium,
    Raleway_700Bold,
    Raleway_800ExtraBold,
    Montserrat_500Medium,
    Montserrat_700Bold,
    Montserrat_800ExtraBold
  });
  
  if (!fontLoaded) {
    return (
      <Image
        source={require('./assets/images/splash.png')}
      />
    )
  } else {
    return (
      <Provider store={store}>
        <SafeAreaProvider>
          <NavigationContainer>
            <SafeAreaView style={general().flex}>
              <Routes/>
            </SafeAreaView>
          </NavigationContainer>
        </SafeAreaProvider>
      </Provider>
    );
  }
};


