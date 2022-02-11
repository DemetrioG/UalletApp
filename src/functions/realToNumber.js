/**
 * @param value Valor no padrão R$0,00 
 * @returns     Valor no padrão Numérico
 */

export default function (value) {
    let newValue = value.replace('R$', '');
    newValue = newValue.replace('.', '');
    newValue = Number(newValue.replace(',', '.'))

    return newValue;
}