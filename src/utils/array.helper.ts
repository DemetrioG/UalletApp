export function sortObjectByKey(
  array: Array<any>,
  key: string,
  order: "desc" | "asc"
) {
  return order === "asc"
    ? array.sort((a, b) => (a[key] > b[key] ? 1 : -1))
    : array.sort((a, b) => (a[key] < b[key] ? 1 : -1));
}

export const groupBy = (items: object[], key: string) =>
  items.reduce(
    (result, item) => ({
      ...result,
      [item[key as keyof typeof item]]: [
        ...(result[item[key as keyof typeof item]] || []),
        item,
      ],
    }),
    {}
  );
