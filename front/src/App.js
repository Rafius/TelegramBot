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
        ({
          description,
          id,
          image,
          hasGarage,
          link,
          meters,
          price,
          priceChanges,
          title
        }) => {
          const data = price.map(({ date, price }) => {
            return {
              name: date,
              uv: price
            };
          });

          return (
            <ul key={id}>
              <li>
                <a href={link}>
                  {title}, {meters} m²
                  <img src={image} alt={description} />
                </a>
              </li>
              <li>Precio: {price.at(-1).price}</li>
              <li>
                Precio por m²: {parseInt((price.at(-1).price * 1000) / meters)}€
              </li>
              <li>Precio original: {price.at(0).price}</li>
              <li>
                Precio por m² original:
                {parseInt((price.at(0).price * 1000) / meters)}€
              </li>
              <li>El precio ha bajado: {priceChanges}k €</li>
              <li>{!hasGarage && "No"} Tiene garaje </li>
              <LineChart
                width={600}
                height={300}
                data={data}
                margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
              >
                <Line type="monotone" dataKey="uv" stroke="#8884d8" />
                <CartesianGrid stroke="#ccc" />
                <XAxis dataKey="name" />
                <YAxis dateKey="date" domain={[100, 600]} />
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
