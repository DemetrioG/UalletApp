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

  if (Platform.OS === "android") {
    newValue = newValue.replace(",", "[");
    newValue = newValue.replace(".", ",");
    newValue = newValue.replace("[", ".");
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
