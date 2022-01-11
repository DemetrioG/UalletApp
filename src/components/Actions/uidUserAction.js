export const editUidUser = (uid) => {
    return {
        type: 'editUid',
        payload: {
            uid: uid
        }
    }
};