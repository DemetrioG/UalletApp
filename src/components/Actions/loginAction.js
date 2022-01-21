export const editLogin = (login) => {
    return {
        type: 'editLogin',
        payload: {
            signed: login
        }
    }
};