// Conversão da data JS para DD/MM/YYY

export default function convertDate(date) {
    const newDate = date.toString();
    let   month   = newDate.slice(4, 7);
    const day     = newDate.slice(8, 10);
    const year    = newDate.slice(11, 15);

    const monthNumber = { 1: 'Jan', 2: 'Feb', 3: 'Mar', 4: 'Apr', 5: 'May', 6: 'Jun', 7: 'Jul', 8: 'Aug', 9: 'Sep', 10: 'Oct', 11: 'Nov', 12: 'Dec' };

    for (let index = 1; index <= Object.keys(monthNumber).length; index++) {
        if (monthNumber[index.toString()] == month) {
            index = index.toString();
            index.length < 2 ? month = `0${index}` : month = index;
            break;
        }
    }
    const finalDate = `${day}/${month}/${year}`;

    return finalDate;
}