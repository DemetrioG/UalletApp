const modal = {
    visibility: false,
    title: '',
    type: '',
}

const AlertReducer = (state = [], action) => {
    if (state.length == 0) {
        return modal;
    }

    if (action.type == 'editVisibility') {
        return {
            ...state, visibility: action.payload.visibility
        }
    }

    if (action.type == 'editTitle') {
        return {
            ...state, title: action.payload.title
        }
    }

    if (action.type == 'editType') {
        return {
            ...state, type: action.payload.type
        }
    }

    return state;
}

export default AlertReducer;