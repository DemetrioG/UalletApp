export const editMonth = (month) => {
    return {
        type: 'editMonth',
        payload: {
            month: month
        }
    }
};