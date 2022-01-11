const modal = {
    modal: false,
}

const VisibilityReducer = (state = [], action) => {
    if (state.length == 0) {
        return modal;
    }

    if (action.type == 'editVisibility') {
        return {
            ...state, modal: action.payload.modal
        }
    }

    return state;
}

export default VisibilityReducer;