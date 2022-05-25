const fetch = require("node-fetch");

const request = async () => {
  const data = await fetch(
    "https://api.fotocasa.es/PropertySearch/Search?combinedLocationIds=724,9,8,227,342,8279,0,0,0&culture=es-ES&hrefLangCultures=ca-ES%3Bes-ES%3Bde-DE%3Ben-GB&isMap=false&isNewConstruction=false&isNewConstructionPromotions=false&latitude=41.5635&longitude=2.01336&pageNumber=3&platformId=1&sortOrderDesc=true&sortType=scoring&transactionTypeId=1&propertyTypeId=2"
  ).then((response) => response.json());

  console.log(data);
};

request();
