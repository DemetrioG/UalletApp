/**
 * @param date Data no padrão Numérico
 * @returns    Data no padrão DD/MM/YYY
 */

export interface ITimestamp {
  nanoseconds: number;
  seconds: number;
}

export default function convertDateFromDatabase({ seconds }: ITimestamp) {
  const newDate = new Date(seconds * 1000).toString();

  const day = newDate.slice(8, 10);
  let month = newDate.slice(4, 7);
  const year = newDate.slice(11, 15);

  const monthNumber = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  for (
    let index: number | string = 0;
    index < Object.keys(monthNumber).length;
    index++
  ) {
    if (monthNumber[index] == month) {
      index += 1;
      index = index.toString();
      index.length < 2 ? (month = `0${index}`) : (month = index);
      break;
    }
  }

  const finalDate = `${day}/${month}/${year}`;

  return finalDate;
}
