import firebase from "../services/firebase";

export interface ITimestamp {
  nanoseconds: number;
  seconds: number;
}

/**
 * @returns Data no padrão DD/MM/YYYY
 */

export function convertDate(date: Date) {
  const newDate = date.toString();
  let month = newDate.slice(4, 7);
  const day = newDate.slice(8, 10);
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

/**
 * @param date Data no padrão Numérico
 * @returns    Data no padrão DD/MM/YYY
 */

export function convertDateFromDatabase({ seconds }: ITimestamp) {
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

/**
 * @param date Data no padrão DD/MM/YYY
 * @returns    Data no padrão Firebase
 */

export function convertDateToDatabase(date: string) {
  const day = date.slice(0, 2);
  const month = date.slice(3, 5);
  const year = date.slice(6, 10);
  const finalDate = new Date(`${month}/${day}/${year} 00:00:01`);

  return firebase.firestore.Timestamp.fromDate(finalDate);
}

/**
 * @param value Mês de referência
 */

// Conversão de mês entre número e string
export function dateMonthNumber(
  type: "toNumber" | "toMonth",
  value: number,
  lang: "pt" | "en",
  complete?: boolean
) {
  let month;
  let data: number | string;
  let refMonth = value;

  if (refMonth == -1) {
    refMonth = 11;
  } else if (refMonth == 0) {
    refMonth = 12;
  }

  switch (lang) {
    case "pt":
      switch (type) {
        case "toNumber":
          month = {
            Jan: 1,
            Fev: 2,
            Mar: 3,
            Abr: 4,
            Mai: 5,
            Jun: 6,
            Jul: 7,
            Ago: 8,
            Set: 9,
            Out: 10,
            Nov: 11,
            Dez: 12,
          };
          data = month[refMonth]!;
          return data;

        case "toMonth":
          !complete
            ? (month = {
                1: "Jan",
                2: "Fev",
                3: "Mar",
                4: "Abr",
                5: "Mai",
                6: "Jun",
                7: "Jul",
                8: "Ago",
                9: "Set",
                10: "Out",
                11: "Nov",
                12: "Dez",
              })
            : (month = {
                1: "Janeiro",
                2: "Fevereiro",
                3: "Março",
                4: "Abril",
                5: "Maio",
                6: "Junho",
                7: "Julho",
                8: "Agosto",
                9: "Setembro",
                10: "Outubro",
                11: "Novembro",
                12: "Dezembro",
              });
          data = month[refMonth.toString()]!;
          return data;
      }

    case "en":
      switch (type) {
        case "toNumber":
          month = {
            Jan: 1,
            Feb: 2,
            Mar: 3,
            Apr: 4,
            May: 5,
            Jun: 6,
            Jul: 7,
            Aug: 8,
            Sep: 9,
            Oct: 10,
            Nov: 11,
            Dec: 12,
          };
          data = month[refMonth]!;
          return data;

        case "toMonth":
          month = {
            1: "Jan",
            2: "Feb",
            3: "Mar",
            4: "Apr",
            5: "May",
            6: "Jun",
            7: "Jul",
            8: "Aug",
            9: "Sep",
            10: "Oct",
            11: "Nov",
            12: "Dec",
          };
          data = month[refMonth.toString()]!;
          return data;
      }
  }
}

/**
 * @param month 1 à 12
 * @returns     Último dia do mês referente
 */

export function getFinalDateMonth(month: number | null, year: number | null) {
  let finalDate = new Date(Number(year), Number(month! - 1) + 1, 0);

  return finalDate.toString().slice(8, 10);
}

/**
 * @param date Data no padrão DD/MM/YYY
 */

export function dateValidation(date: string) {
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

/**
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
