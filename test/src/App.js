import "./App.css";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip
} from "recharts";
import { housesWithPriceChanged } from "./helper";

function App() {
  return (
    <div className="container">
      {housesWithPriceChanged.map(
        ({ id, link, meters, price, priceChanges, title }) => {
          const data = price.map(({ date, price }) => {
            return {
              name: date,
              uv: price
            };
          });

          return (
            <ul key={id}>
              <li>
                <a href={link}> {title}</a>
              </li>
              <li>
                Precio: {price.at(-1).price}, {meters} m²
              </li>
              <li>
                Precio por m²: {parseInt((price.at(-1).price * 1000) / meters)}€
              </li>
              <li>Precio original: {price.at(0).price}</li>
              <li>
                Precio por m² original:
                {parseInt((price.at(0).price * 1000) / meters)}€
              </li>
              <li>El precio ha bajado: {priceChanges}k €</li>

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
          );
        }
      )}
    </div>
  );
}

export default App;
