export const editTypeAlert = (type) => {
    return {
        type: 'editType',
        payload: {
            type: type
        }
    }
};