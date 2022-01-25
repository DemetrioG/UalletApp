export const editName = (name) => {
    return {
        type: 'editName',
        payload: {
            name: name
        }
    }
};