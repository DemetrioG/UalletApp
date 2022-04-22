/**
 * @param value Mês de referência
 */

// Conversão de mês entre número e string
export default function dateMonthNumber(
  type: "toNumber" | "toMonth",
  value: number,
  lang: "pt" | "en"
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
          month = {
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
          };
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
