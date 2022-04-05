import { combineReducers } from "redux";
import ThemeReducer from "./themeReducer";
import AlertReducer from "./alertReducer";
import UserReducer from "./userReducer";
import LoginReducer from "./loginReducer";
import NameReducer from "./nameReducer";
import DateReducer from "./dateReducer";
import CompleteUserReducer from "./completeUserReducer";
import ModalityReducer from "./modalityReducer";
import React from "react";

export interface IReduxProps {
  theme: { theme: string };
  modal: { visibility: boolean; title: string; type: string };
  login: { signed: boolean };
  editTheme: (theme: string) => void;
  editUidUser: (uid: string | null) => void;
  editLogin: (login: boolean) => void;
}

const Reducers = combineReducers({
  theme: ThemeReducer,
  modal: AlertReducer,
  user: UserReducer,
  login: LoginReducer,
  name: NameReducer,
  date: DateReducer,
  complete: CompleteUserReducer,
  modality: ModalityReducer,
});

export default Reducers;
