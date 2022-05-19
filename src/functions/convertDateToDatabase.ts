import firebase from "../services/firebase";

/**
 * @param date Data no padrão DD/MM/YYY
 * @returns    Data no padrão Numérico
 */

export default function convertDateToDatabase(date: string) {
  const day = date.slice(0, 2);
  const month = date.slice(3, 5);
  const year = date.slice(6, 10);
  const hour = new Date().getHours();
  const minutes = new Date().getMinutes();
  const seconds = new Date().getSeconds();
  const finalDate = new Date(
    `${month}/${day}/${year} ${hour}:${minutes}:${seconds}`
  );

  return firebase.firestore.Timestamp.fromDate(finalDate);
}
