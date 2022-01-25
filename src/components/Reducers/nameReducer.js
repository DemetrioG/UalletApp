const name = {
    name: '',
}

const NameReducer = (state = [], action) => {
    if (state.length == 0) {
        return name;
    }

    if (action.type == 'editName') {
        return {
            ...state, name: action.payload.name
        }
    }

    return state;
}

export default NameReducer;