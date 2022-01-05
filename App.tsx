import React from 'react';
import { Image, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import Routes from './src/routes';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import SafeAreaView from 'react-native-safe-area-view';
import { general } from './src/styles';

export default function App() {

  let [fontLoaded] = useFonts ({
    'RalewayMedium' : require('./assets/fonts/Raleway-Medium.ttf'),
    'RalewayBold' : require('./assets/fonts/Raleway-Bold.ttf'),
    'RalewayExtraBold' : require('./assets/fonts/Raleway-ExtraBold.ttf'),
    'MontserratMedium' : require('./assets/fonts/Montserrat-Medium.ttf'),
    'MontserratBold' : require('./assets/fonts/Montserrat-Bold.ttf'),
    'MontserratExtraBold' : require('./assets/fonts/Montserrat-ExtraBold.ttf'),
  })

  if (!fontLoaded) {
    return (
      <Image
        source={require('./assets/images/splash.png')}
      />
    )
  } else {
    return (
      <SafeAreaProvider>
        <NavigationContainer>
          <SafeAreaView style={[general.flex, general.statusBar]}>
            <Routes/>
          </SafeAreaView>
        </NavigationContainer>
      </SafeAreaProvider>
    );
  }
}


