// Converte a data DD/MM/YYY para Number para salvar no banco

export default function convertDateToDatabase(date) {
    return Date.parse(date);
}