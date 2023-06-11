import { Platform } from "react-native";

/**
 * No Android, o toLocaleString não funciona, então é passado esse require para funcionar corretamente
 */
if (Platform.OS === "android") {
  require("intl");
  require("intl/locale-data/jsonp/en-IN");
}

/**
 * Converte número para padrão Real
 * @returns Valor no padrão R$ 0,00
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
    newValue = newValue.replace(/\s/g, "");
  }

  return newValue.replace(/\s/g, "");
}

/**
 * Converte padrão Real para número
 * @param value Valor no padrão R$0,00
 * @returns Valor no padrão Numérico
 */
export function realToNumber(value: string) {
  let newValue = value.replace("R$", "");
  newValue = newValue.split(".").join("");
  newValue = newValue.replace(/\s/g, "");

  return Number(newValue.replace(",", "."));
}

/**
 * Converte percentual para número
 * @param value Valor no padrão % 120,00
 * @returns Valor no padrão Numérico
 */
export function percentualToNumber(value: string) {
  let newValue = value.replace("% ", "");
  newValue = newValue.split(".").join("");

  return Number(newValue.replace(",", "."));
}

/**
 * Converte padrão numérico para percentual
 * @param value Valor no padrão Numérico
 * @returns Valor no padrão % 120,00
 */
export function numberToPercentual(value: number) {
  let newValue = value.toString().replace(".", ",");

  return newValue + "%";
}

/**
 * Retorna a média entre dois números
 */
export function averageBetweenNumbers(
  firstNumber: number,
  secondNumber: number
) {
  const value = Number(((firstNumber + secondNumber) / 2).toFixed(2));
  return value;
}

/**
 * @returns Retorna a o Lucro / Perda entre o primeiro e o segundo número
 */
export function getRent(firstNumber: number, secondNumber: number) {
  const value = Number((secondNumber - firstNumber).toFixed(2));
  return value;
}

/**
 * Retorna o percentual de crescimento entre dois números
 */
export function getRentPercentual(firstNumber: number, secondNumber: number) {
  if (firstNumber && secondNumber) {
    const value = numberToReal(
      Number((((secondNumber - firstNumber) / firstNumber) * 100).toFixed(2)),
      true
    );
    return value;
  } else {
    return "0,00";
  }
}
