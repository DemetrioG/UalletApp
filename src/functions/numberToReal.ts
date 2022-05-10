import { Platform } from "react-native";

// No Android, o toLocaleString não funciona, então é passado esse require para funcionar corretamente
if (Platform.OS === "android") {
  require("intl");
  require("intl/locale-data/jsonp/en-IN");
}

/**
 * @returns      Valor no padrão R$ 0,00
 */

export default function numberToReal(number: number) {
  let newValue = number.toLocaleString("pt-br", {
    style: "currency",
    currency: "BRL",
  });

  if (Platform.OS === "android") {
    newValue = newValue.replace(",", "-");
    newValue = newValue.replace(".", ",");
    newValue = newValue.replace("-", ".");
  }

  return newValue;
}
