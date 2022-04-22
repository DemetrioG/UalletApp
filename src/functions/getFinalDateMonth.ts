/**
 * @returns     Último dia do mês referente
 */

export default function getFinalDateMonth(
  month: number | null,
  year: number | null
) {
  let finalDate = new Date(Number(year), Number(month! - 1) + 1, 0);

  return finalDate.toString().slice(8, 10);
}
