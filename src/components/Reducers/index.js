import { combineReducers } from 'redux';
import ThemeReducer from './themeReducer';
import AlertReducer from './alertReducer';
import UserReducer from './userReducer';
import LoginReducer from './loginReducer';
import NameReducer from './nameReducer';

const Reducers  = combineReducers({
    theme: ThemeReducer,
    modal: AlertReducer,
    user: UserReducer,
    login: LoginReducer,
    name: NameReducer
});

export default Reducers;