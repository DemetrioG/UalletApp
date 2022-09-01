/**
 * Ordena um array de objeto pela chave informada
 */
export function sortObjectByKey(
  array: Array<any>,
  key: string,
  order: "desc" | "asc"
) {
  return order === "asc"
    ? array.sort((a, b) => (a[key] > b[key] ? 1 : -1))
    : array.sort((a, b) => (a[key] < b[key] ? 1 : -1));
}
