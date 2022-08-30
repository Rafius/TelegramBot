let houses = [{}];

let links = document.querySelectorAll(".item-link");

const prices = document.querySelectorAll(".item-price");

const details = document.querySelectorAll(".item-detail-char");

const descriptions = document.querySelectorAll(".item-description");

const images = document.querySelectorAll(".mask");

const linksFiltered = [];

for (let i = 0; i < links.length; i++) {
  const title = links[i].innerText;
  if (!(prices[i] || details[i] || descriptions[i])) continue;
  if (title.includes("Comparar")) continue;
  linksFiltered.push(links[i]);
}

links = linksFiltered;

for (let i = 0; i < links.length; i++) {
  houses.push({
    id: parseInt(links[i].href.split("/")[4]),
    title: links[i].innerText,
    link: links[i].href,
    price: {
      date: new Date().toLocaleDateString(),
      price: prices[i].innerText.slice(0, -1)
    },
    detail: details[i].innerText,
    description: descriptions[i].textContent,
    meters: details[i].innerText.split("m²")[0].slice(-4).trim(),
    image: images[i].getElementsByTagName("img")[0].src
  });
}

houses = houses
  .filter((value) => Object.keys(value).length !== 0)
  .sort((a, b) => a.price - b.price);

fetch("http://localhost/saveHouses", {
  method: "POST",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json;charset=UTF-8"
  },
  body: JSON.stringify(houses)
}).then((res) => res.json());
