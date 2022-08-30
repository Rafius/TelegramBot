import houses from "./houses";
import "./App.css";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip
} from "recharts";

const housesGroupById = houses.reduce((acc, house) => {
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
    return {
      ...item,
      priceChanges: `${(price[0].price - price[price.length - 1].price).toFixed(
        2
      )}k €`
    };
  })
  .sort((a, b) => a.priceChanges - b.priceChanges);

function App() {
  return housesWithPriceChanged.map(
    ({ id, description, link, meters, price, priceChanges, title }) => {
      console.log(price);

      const data = price.map(({ date, price }) => {
        return {
          name: date,
          uv: price
        };
      });

      return (
        <a href={link} className="container" key={id}>
          <ul>
            <li>{title}</li>
            <li>{description}</li>
            <li>{meters} m²</li>
            <li>{priceChanges}</li>
            <LineChart
              width={600}
              height={300}
              data={data}
              margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
            >
              <Line type="monotone" dataKey="uv" stroke="#8884d8" />
              <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
              <XAxis dataKey="name" />
              <YAxis dateKey="date" />
              <Tooltip />
            </LineChart>
          </ul>
        </a>
      );
    }
  );
}

export default App;
