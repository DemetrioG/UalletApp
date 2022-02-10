/**
 * @param props Redux props
 */

// Função para retornar o último dia do mês de referência

export default function getFinalDateMonth(props) {
    const date    = new Date;
    let finalDate = new Date(Number(props.year), Number(props.month - 1) + 1, 0);
    finalDate     = finalDate.toString().slice(8, 10);
    
    return finalDate;
}