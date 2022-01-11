export const editTitleAlert = (title) => {
    return {
        type: 'editTitle',
        payload: {
            title: title
        }
    }
};