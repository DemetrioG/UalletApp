export const editVisibilityAlert = (visibility) => {
    return {
        type: 'editVisibility',
        payload: {
            visibility: visibility
        }
    }
};