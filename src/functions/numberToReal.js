import { Platform } from 'react-native';

// No Android, o toLocaleString não funciona, então é passado esse require para funcionar corretamente
if (Platform.OS === 'android') {
    require('intl');
    require('intl/locale-data/jsonp/en-IN');
}

/**
 * @param number Valor no padrão Numérico
 * @returns      Valor no padrão R$ 0,00
 */

export default function numberToReal(number) {
    let newValue = number.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'});
    newValue = newValue.replace(',', '-');
    newValue = newValue.replace('.', ',');
    newValue = newValue.replace('-', '.');

    return newValue;
}