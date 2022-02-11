/**
 * @param props Redux props
 * @returns     Último dia do mês referente
 */

export default function getFinalDateMonth(props) {
    const date    = new Date;
    let finalDate = new Date(Number(props.year), Number(props.month - 1) + 1, 0);
    finalDate     = finalDate.toString().slice(8, 10);
    
    return finalDate;
}