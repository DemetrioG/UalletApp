// Converte a data DD/MM/YYY para Number para salvar no banco

export default function convertDateToDatabase(date) {
    const day   = date.slice(0, 2);
    const month = date.slice(3, 5);
    const year  = date.slice(6, 10);

    return Date.parse(`${month}/${day}/${year}`);
}