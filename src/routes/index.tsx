import React, { useEffect } from "react";
import { Appearance } from "react-native";
import { connect } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { editTheme } from "../components/Actions/themeAction";
import { editLogin } from "../components/Actions/loginAction";
import { editUidUser } from "../components/Actions/uidUserAction";
import AuthRoutes from "./authRoutes";
import AppRoutes from "./appRoutes";
import { IReduxProps } from "../components/Reducers";

export function routes(props: IReduxProps) {
  useEffect(() => {
    props.editTheme(Appearance.getColorScheme() || "light");

    async function loadStorage() {
      const storageUser = (await AsyncStorage.getItem("authUser")) || "";

      // Parseia as datas para numero e compara se a data do storage está expirada
      if (
        Date.parse(JSON.parse(storageUser).date) >
        Date.parse(new Date(Date.now()).toString())
      ) {
        props.editUidUser(JSON.parse(storageUser).uid);
        props.editLogin(true);
      } else {
        props.editLogin(false);
      }
    }

    // loadStorage();
  }, []);

  Appearance.addChangeListener(() => {
    props.editTheme(Appearance.getColorScheme() || "light");
  });

  return props.login ? <AppRoutes /> : <AuthRoutes />;
}

const mapStateToProps = (state: any) => {
  return {
    theme: state.theme.theme,
    login: state.login.signed,
  };
};

const routesConnect: React.FC = connect(mapStateToProps, {
  editTheme,
  editLogin,
  editUidUser,
})(routes);

export default routesConnect;
