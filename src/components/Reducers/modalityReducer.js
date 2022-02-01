const modality = {
    modality: 'Real',
}

const ModalityReducer = (state = [], action) => {
    if (state.length == 0) {
        return modality;
    }

    if (action.type == 'editModality') {
        return {
            ...state, modality: action.payload.modality
        }
    }

    return state;
}

export default ModalityReducer;