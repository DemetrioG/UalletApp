/**
 * @param month Redux month
 * @param year  Redux year
 * @returns     Último dia do mês referente
 */

export default function getFinalDateMonth(month, year) {
    const date    = new Date;
    let finalDate = new Date(Number(year), Number(month - 1) + 1, 0);
    finalDate     = finalDate.toString().slice(8, 10);
    
    return finalDate;
}