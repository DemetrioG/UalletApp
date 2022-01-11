import { combineReducers } from 'redux';
import ThemeReducer from './themeReducer';
import AlertReducer from './alertReducer';
import UserReducer from './userReducer';

const Reducers  = combineReducers({
    theme: ThemeReducer,
    modal: AlertReducer,
    user: UserReducer
});

export default Reducers;