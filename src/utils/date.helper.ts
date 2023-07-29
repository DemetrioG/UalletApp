import { Timestamp } from "firebase/firestore";
import {
  endOfDay,
  endOfMonth,
  startOfDay,
  setHours,
  subHours,
  format,
  fromUnixTime,
} from "date-fns";

export interface ITimestamp {
  nanoseconds: number;
  seconds: number;
}

/**
 * Converte data no padrão JS para DD/MM/YYYY
 * @returns Data no padrão DD/MM/YYYY
 */
export function convertDate(date: Date) {
  return format(date, "dd/MM/yyyy");
}

/**
 * Converte da Timestamp para DD/MM/YYYY
 * @param date Data no padrão Numérico
 * @returns    Data no padrão DD/MM/YYY
 */
export function convertDateFromDatabase({ seconds }: ITimestamp) {
  return format(fromUnixTime(seconds), "dd/MM/yyyy");
}

/**
 * Converte data DD/MM/YYYY para Timestamp
 * @param date Data no padrão DD/MM/YYY
 * @returns    Data no padrão Firebase
 */
export function convertDateToDatabase(date: string) {
  const day = date.slice(0, 2);
  const month = date.slice(3, 5);
  const year = date.slice(6, 10);
  const finalDate = new Date(`${year}-${month}-${day}T00:00:01`);

  return Timestamp.fromDate(finalDate);
}

/**
 * Retorna o último dia do mês informado
 * @param month 1 à 12
 * @returns     Último dia do mês referente
 */
export function getFinalDateMonth(month: number | null, year: number | null) {
  let finalDate = new Date(Number(year), Number(month! - 1) + 1, 0);

  return finalDate.toString().slice(8, 10);
}

/**
 * Valida a data informada
 * @param date Data no padrão DD/MM/YYY
 */
export function dateValidation(date: string) {
  const dateValidation =
    /^(0[1-9]|[12][0-9]|3[01])[\/ \/.](0[1-9]|1[012])[\/ \/.](19|20)\d\d$/;

  return dateValidation.test(date);
}

/**
 * Retorna a data futura da atual conforme o índice informado.
 * Ex: date = 01/01/2022 e index = 2. Irá retornar 01/03/2022
 * @param date Data no padrão DD/MM/YYYY
 */
export function futureDate(date: string, index: number) {
  let day: number | string = Number(date.slice(0, 2));
  let month: number | string = Number(date.slice(3, 5));
  let year = Number(date.slice(6));

  month = Number(month) + index;

  let monthDiference = Number(month) - 12;

  if (monthDiference > 0) {
    month = monthDiference;
    year++;
  }

  if (Number(getFinalDateMonth(month, year)) < day) {
    day = getFinalDateMonth(month, year);
  }

  day = day.toString().length === 1 ? `0${day}` : day;
  month = month.toString().length === 1 ? `0${month}` : month;

  return `${day}/${month}/${year}`;
}

/**
 * Retorna a data atual
 */
export function getAtualDate() {
  const date = new Date();
  const initialDate = setHours(startOfDay(date), -3);
  const finalDate = subHours(endOfDay(date), 3);
  return [initialDate, finalDate];
}

export function getMonthDate(month: number, year: number) {
  const initialDate = new Date(year, month - 1, 1);
  initialDate.setHours(0, 0, 0, 0);
  const finalDate = endOfMonth(new Date(year, month - 1));
  finalDate.setHours(23, 59, 59, 999);

  return [initialDate, finalDate];
}
