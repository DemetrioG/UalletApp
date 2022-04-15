import * as React from "react";
import { Appearance } from "react-native";
import { connect } from "react-redux";
import { editTheme } from "../components/Actions/themeAction";
import AuthRoutes from "./authRoutes";
import AppRoutes from "./appRoutes";
import { IReduxProps } from "../components/Reducers";
import { getStorage } from "../functions/storageData";
import { UserContext } from "../context/User/userContext";

export function routes(props: IReduxProps) {
  const { user, setUser } = React.useContext(UserContext);

  React.useEffect(() => {
    props.editTheme(Appearance.getColorScheme() || "light");

    async function loadStorage() {
      const storageUser = await getStorage("authUser");

      // Parseia as datas para numero e compara se a data do storage está expirada
      if (
        Date.parse(storageUser.date) >
        Date.parse(new Date(Date.now()).toString())
      ) {
        setUser((userState) => ({
          ...userState,
          uid: storageUser.uid,
          signed: true,
        }));
      }
    }

    loadStorage();
  }, []);

  Appearance.addChangeListener(() => {
    props.editTheme(Appearance.getColorScheme() || "light");
  });

  return user.signed ? <AppRoutes /> : <AuthRoutes />;
}

const mapStateToProps = (state: any) => {
  return {
    theme: state.theme.theme,
  };
};

const routesConnect: React.FC = connect(mapStateToProps, {
  editTheme,
})(routes);

export default routesConnect;
