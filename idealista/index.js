const express = require("express");
var bodyParser = require("body-parser");

const app = express();
const cors = require("cors");
const fs = require("fs");
const jsonParser = bodyParser.json();
const housesFile = require("../front/src/houses.json");

app.use(cors());
const server = app.listen(80, function () {
  const host = server.address().address;
  const port = server.address().port;
  console.log("Example app listening at http://%s:%s", host, port);
});

app.post("/saveHouses", jsonParser, async (req, res) => {
  console.log(req.body);
  saveHouses(req.body);
  res.send({ status: "Success" });
});

const saveHouses = (houses) => {
  let newHouses = [...houses, ...housesFile];

  const housesGroupById = newHouses.reduce((acc, house) => {
    (acc[house.id] = acc[house.id] || []).push(house);
    return acc;
  }, {});

  // Remove sold houses

  newHouses = Object.values(housesGroupById)
    .map((houses) => {
      const houseIsOnSale =
        houses.at(-1).price.date === new Date().toLocaleDateString();

      if (!houseIsOnSale) return null;

      const house = houses[0];

      const prices = houses.map((house) => house.price.price);

      house.price = houses
        .filter(({ price }, index) => {
          return !prices.includes(price.price, index + 1);
        })
        .map((item) => item.price);

      return house;
    })
    .filter((houses) => houses);

  fs.writeFile("./front/src/houses.json", JSON.stringify(newHouses), (err) => {
    if (err) throw err;
    console.log("Houses saved");
  });
};
