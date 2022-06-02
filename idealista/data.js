const housesFile = require("./houses.json");

const housesGroupById = housesFile.reduce((acc, house) => {
  (acc[house.id] = acc[house.id] || []).push(house);
  return acc;
}, {});

const removeDuplicatedPrices = (house) =>
  house.price.reduce((acc, current) => {
    const x = acc.find((item) => item.price === current.price);
    if (!x) return acc.concat([current]);
    return acc;
  }, []);

const allHouses = Object.values(housesGroupById).map((houses) => {
  let house = houses[0];

  house.price = houses.map((house) => house.price);

  house.price = removeDuplicatedPrices(house);

  return house;
});

const housesWithPriceChanged = allHouses
  .filter((house) => Object.keys(house.price).length > 1)
  .map((item) => {
    const { price } = item;
    console.log(price[0].price, price[price.length - 1].price);
    return {
      ...item,
      priceChanges: `${(price[0].price - price[price.length - 1].price).toFixed(
        2
      )}k €`
    };
  });

console.log(
  JSON.stringify(housesWithPriceChanged, null, 2),
  `Casas que han cambiado el precio: ${housesWithPriceChanged.length}`
);

const getHousesPricePerMeter = (house) => {
  const pricesPerMeter = allHouses.map((item) => {
    const pricePerMeter = (
      (parseFloat(item.price[0].price) / parseInt(item.meters)) *
      1000
    ).toFixed(2);

    return {
      item,
      pricePerMeter
    };
  });

  return pricesPerMeter.sort((a, b) => a.pricePerMeter - b.pricePerMeter);
};

const housesPricePerMeter = getHousesPricePerMeter();
// console.log("Precio por metro", housesPricePerMeter);
