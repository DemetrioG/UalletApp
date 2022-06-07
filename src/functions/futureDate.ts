import getFinalDateMonth from "./getFinalDateMonth";

/**
 * @param date Data no padrão DD/MM/YYYY
 */

export default function futureDate(date: string, index: number) {
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
