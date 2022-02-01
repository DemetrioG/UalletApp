import { combineReducers } from 'redux';
import ThemeReducer from './themeReducer';
import AlertReducer from './alertReducer';
import UserReducer from './userReducer';
import LoginReducer from './loginReducer';
import NameReducer from './nameReducer';
import DateReducer from './dateReducer';
import CompleteUserReducer from './completeUserReducer';
import ModalityReducer from './modalityReducer';

const Reducers  = combineReducers({
    theme: ThemeReducer,
    modal: AlertReducer,
    user: UserReducer,
    login: LoginReducer,
    name: NameReducer,
    date: DateReducer,
    complete: CompleteUserReducer,
    modality: ModalityReducer
});

export default Reducers;