export function sortByText<T>(data: T[], key: (a: T) => string, order: any) {
  return data.sort((a, b) => {
    const textA = key(a);
    const textB = key(b);

    if (textA > textB && order === "asc") {
      return 1;
    } else {
      return -1;
    }
  });
}
