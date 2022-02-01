export const editModality = (modality) => {
    return {
        type: 'editModality',
        payload: {
            modality: modality
        }
    }
};