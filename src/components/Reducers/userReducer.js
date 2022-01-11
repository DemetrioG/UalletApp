const user = {
    uid: null,
}

const UserReducer = (state = [], action) => {
    if (state.length == 0) {
        return user;
    }

    if (action.type == 'editUid') {
        return {
            ...state, uid: action.payload.uid
        }
    }

    return state;
}

export default UserReducer;