const signed = {
    signed: false,
}

const LoginReducer = (state = [], action) => {
    if (state.length == 0) {
        return signed;
    }

    if (action.type == 'editLogin') {
        return {
            ...state, signed: action.payload.signed
        }
    }

    return state;
}

export default LoginReducer;