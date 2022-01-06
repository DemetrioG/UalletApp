const theme = {
    theme: '',
}

const ThemeReducer = (state = [], action) => {
    if (state.length == 0) {
        return theme;
    }

    if (action.type == 'editTheme') {
        return {
            ...state, theme: action.payload.theme
        }
    }

    return state;
}

export default ThemeReducer;