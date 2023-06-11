import firebase from "@services/firebase";

export interface ITimestamp {
  nanoseconds: number;
  seconds: number;
}

/**
 * Converte data no padrão JS para DD/MM/YYYY
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
 * Converte da Timestamp para DD/MM/YYYY
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
 * Converte data DD/MM/YYYY para Timestamp
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
 * Conversão de mês entre número e string
 * @param value Mês de referência
 */
export function dateMonthNumber(
  type: "toNumber" | "toMonth",
  value: number,
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
  const dateInfo = [];
  const atualDate = `${
    date.getMonth() + 1
  }/${date.getDate()}/${date.getFullYear()}`;
  const atualDateBR = `${date.getDate()}/${
    date.getMonth() + 1
  }/${date.getFullYear()}`;
  const initialDate = atualDate + " 00:00:01";
  const finalDate = atualDate + " 23:59:59";

  dateInfo.push(
    new Date(atualDate),
    new Date(initialDate),
    new Date(finalDate),
    atualDateBR
  );

  return dateInfo;
}

/**
 * Converte segundos para JS Date
 */
export function secondsToDate(seconds: number) {
  const date = new Date();
  date.setSeconds(seconds);
  return date;
}
