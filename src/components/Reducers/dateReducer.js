const date = {
    month: null,
    year: null,
}

const DateReducer = (state = [], action) => {
    if (state.length == 0) {
        return date;
    }

    if (action.type == 'editMonth') {
        return {
            ...state, month: action.payload.month
        }
    }

    if (action.type == 'editYear') {
        return {
            ...state, year: action.payload.year
        }
    }

    return state;
}

export default DateReducer;