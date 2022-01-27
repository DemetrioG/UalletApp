const complete = {
    complete: false,
}

const CompleteUserReducer = (state = [], action) => {
    if (state.length == 0) {
        return complete;
    }

    if (action.type == 'editComplete') {
        return {
            ...state, complete: action.payload.complete
        }
    }

    return state;
}

export default CompleteUserReducer;