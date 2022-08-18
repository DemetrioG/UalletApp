import { Platform } from "react-native";

// No Android, o toLocaleString não funciona, então é passado esse require para funcionar corretamente
if (Platform.OS === "android") {
  require("intl");
  require("intl/locale-data/jsonp/en-IN");
}

/**
 * @returns      Valor no padrão R$ 0,00
 */

export function numberToReal(number: number, withoutSign?: boolean) {
  let newValue = number.toLocaleString("pt-br", {
    style: "currency",
    currency: "BRL",
  });

  // No Android, o toLocaleString não retorna os números corretamente, então é preciso tratar por código
  if (Platform.OS === "android") {
    newValue = newValue.replace(",", "[");
    newValue = newValue.replace(".", ",");
    newValue = newValue.replace("[", ".");

    let androidCheckValue = newValue
      .replace(".", "")
      .replace(",", "")
      .replace("R$", "");
    let androidCheckValueLength = androidCheckValue.length;

    if (androidCheckValueLength > 7) {
      let cents =
        "," +
        androidCheckValue.slice(
          androidCheckValueLength - 2,
          androidCheckValueLength
        );

      androidCheckValue = androidCheckValue.slice(
        0,
        androidCheckValueLength - 3
      );

      androidCheckValueLength = androidCheckValue.length;

      for (
        let index = androidCheckValueLength - 3;
        index > 1;
        index = index - 3
      ) {
        androidCheckValue =
          androidCheckValue.slice(0, index) +
          "." +
          androidCheckValue.slice(index);
      }

      newValue = "R$" + androidCheckValue + cents;
    }
  }

  if (withoutSign) {
    newValue = newValue.replace("R$", "");
  }

  return newValue;
}

/**
 * @param value Valor no padrão R$0,00
 * @returns     Valor no padrão Numérico
 */

export function realToNumber(value: string) {
  let newValue = value.replace("R$", "");
  newValue = newValue.split(".").join("");

  return Number(newValue.replace(",", "."));
}

/**
 * @param value Valor no padrão % 120,00
 * @returns Valor no padrão Numérico
 */
export function percentualToNumber(value: string) {
  let newValue = value.replace('% ', '');
  newValue = newValue.split('.').join('');

  return Number(newValue.replace(',', '.'));
}
