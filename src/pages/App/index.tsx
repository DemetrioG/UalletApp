import * as React from "react";
import { StatusBar, View, Platform } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { connect } from "react-redux";
import styled from "styled-components";

import { IReduxProps } from "../../components/Reducers";
import Routes from "../../routes";

interface IProps {
  theme: string;
}

const IphoneStatusBar = styled(View)`
  width: 100%;
  height: 100px;
  position: absolute;
  top: 0;
  left: 0;
  background-color: ${({ theme }) => theme.default.primary};
`;

export function App(props: IProps) {
  return (
    <SafeAreaProvider>
      {Platform.OS === "ios" && (
        // Backgound da StatusBar no iPhone
        <IphoneStatusBar />
      )}
      <StatusBar
        barStyle={
          Platform.OS === "ios" && props.theme == "light"
            ? "dark-content"
            : "light-content"
        }
      />
      <Routes />
    </SafeAreaProvider>
  );
}

const mapStateToProps = (state: IReduxProps) => {
  return {
    theme: state.theme.theme,
  };
};

const appConnect: React.FC = connect(mapStateToProps)(App);

export default appConnect;
