import { combineReducers } from 'redux';
import ThemeReducer from './themeReducer';

const Reducers  = combineReducers({
    theme: ThemeReducer
});

export default Reducers;