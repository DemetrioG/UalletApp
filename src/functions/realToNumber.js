// Conversão de tipo R$100,00 para 100

export default function (value) {
    let newValue = value.replace('R$', '');
    newValue = newValue.replace('.', '');
    newValue = Number(newValue.replace(',', '.'))

    return newValue;
}