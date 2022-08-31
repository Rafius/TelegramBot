import houses from "./houses.json";

export const housesWithPriceChanged = houses
  .filter((house) => Object.keys(house.price).length)
  .map((item) => {
    const { price } = item;
    return {
      ...item,
      priceChanges: (
        Number(price[0].price) - Number(price.at(-1).price)
      ).toFixed(2)
    };
  })
  .sort((a, b) => b.priceChanges - a.priceChanges);
