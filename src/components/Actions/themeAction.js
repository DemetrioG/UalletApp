export const editTheme = (theme) => {
    return {
        type: 'editTheme',
        payload: {
            theme: theme
        }
    }
};