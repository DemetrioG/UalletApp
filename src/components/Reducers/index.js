import { combineReducers } from 'redux';
import ThemeReducer from './themeReducer';
import VisibilityReducer from './visibilityReducer';

const Reducers  = combineReducers({
    theme: ThemeReducer,
    modal: VisibilityReducer
});

export default Reducers;