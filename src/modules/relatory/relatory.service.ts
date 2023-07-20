import prismaClient from "@database";

export default {
  async findAdnAddByCategory() {
    const products = await prismaClient.product.findMany();

    const categoriesAndAmounts = products.reduce(
      (acc, { categoryName, price }) => {
        return {
          ...acc,
          [categoryName as string]: acc[categoryName as string]
            ? acc[categoryName as string] + parseFloat(price)
            : parseFloat(price),
        };
      },
      {} as any
    );

    return categoriesAndAmounts;
  },
};
