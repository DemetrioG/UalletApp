import getFinalDateMonth from "./getFinalDateMonth";

/**
 * @param date Data no padrão DD/MM/YYY
 */

export default function dateValidation(date: string) {
  if (date.length < 10) {
    return false;
  }
  const day = Number(date.slice(0, 2));
  const month = Number(date.slice(3, 5));
  const year = Number(date.slice(6, 10));

  // Validação do dia
  if (day < 1 || day > Number(getFinalDateMonth(month, year))) {
    return false;
  }

  if (month < 1 || month > 12) {
    return false;
  }

  if (year < 1000 || year > 3000) {
    return false;
  }

  return true;
}
