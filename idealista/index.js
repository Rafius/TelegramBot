const express = require("express");
var bodyParser = require("body-parser");

const app = express();
const cors = require("cors");
const fs = require("fs");
const jsonParser = bodyParser.json();
const housesFile = require("./houses.json");

app.use(cors());
const server = app.listen(80, function () {
  const host = server.address().address;
  const port = server.address().port;
  console.log("Example app listening at http://%s:%s", host, port);
});

app.post("/saveHouses", jsonParser, async (req, res) => {
  console.log(req.body[0]);
  saveHouses(req.body);
  res.send({ status: "Success" });
});

const saveHouses = (houses) =>
  fs.writeFile(
    "idealista/houses.json",
    JSON.stringify([...housesFile, ...Object.values(houses)].flat()),
    (err) => {
      if (err) throw err;
      console.log("Houses saved");
    }
  );
