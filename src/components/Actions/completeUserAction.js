export const editComplete = (bool) => {
    return {
        type: 'editComplete',
        payload: {
            complete: bool
        }
    }
};