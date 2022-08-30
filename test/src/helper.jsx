import houses from "./houses";

export const housesWithPriceChanged = houses
  .filter(
    (house) =>
      Object.keys(house.price).length > 1 && // Limpiar los que no ha cambiado el precio
      house.price.at(-1).date === new Date().toLocaleDateString() // Limpiar los que ya no existen
  )
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
