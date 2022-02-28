import React from 'react';
import { StatusBar, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { connect } from 'react-redux';

import { colors } from '../../styles/index';
import Routes from '../../routes';

export function App(props) {
    return (
        <SafeAreaProvider>
            {Platform.OS === 'ios' &&
            // Backgound da StatusBar no iPhone
            <View style={{
                width: "100%",
                height: 100,
                position: 'absolute',
                top: 0,
                left: 0,
                backgroundColor: props.theme == 'light' ? colors.lightPrimary : colors.darkPrimary}}
            />}
            <StatusBar
                barStyle={Platform.OS === 'ios' && props.theme == 'light' ? 'dark-content' : 'light-content'}
            />
            <Routes/>
        </SafeAreaProvider>
    );
};

const mapStateToProps = (state) => {
    return {
        theme: state.theme.theme,
    }
  }
  
const appConnect = connect(mapStateToProps)(App);

export default appConnect;