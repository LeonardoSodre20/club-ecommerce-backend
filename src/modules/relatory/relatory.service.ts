import prismaClient from "@database";

export default {
  async findAndAddByCategory() {
    const products = await prismaClient.product.findMany();

    const categoriesAndAmounts = products.reduce(
      (acc: { category: string; total: number }[], item) => {
        const categoryName = item.categoryName as string;
        const price = parseFloat(item.price);

        const existingCategory = acc.find(
          (element) => element.category === categoryName
        );

        if (existingCategory) {
          existingCategory.total += price;
        } else {
          acc.push({ category: categoryName, total: price });
        }

        return acc;
      },
      []
    );

    return categoriesAndAmounts;
  },
};
