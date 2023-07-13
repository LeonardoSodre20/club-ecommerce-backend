function SortByText<T>(
  data: T[],
  key: (b: T) => string,
  order: "asc" | "desc"
) {
  return data.sort((a, b) => {
    const txtA = key(a);
    const txtB = key(b);

    if (txtA > txtB) {
      if (order === "desc") return 1;
    }

    if (txtA < txtB) {
      if (order === "asc") return -1;
    }

    return 0;
  });
}

export default { SortByText };
