const fetch = require("node-fetch");
require("dotenv").config({ path: ".env" });

async function telegram(text) {
  const baseURL = "https://api.telegram.org/bot";
  const token = process.env.TOKEN;
  const chat_id = process.env.CHAT_ID;
  const parse_mode = "MarkdownV2";
  const endPoint = "sendMessage";

  //fetch url
  const url = new URL(`${baseURL}${token}/${endPoint}`);
  const params = {
    chat_id,
    parse_mode,
    text
  };

  Object.keys(params).forEach((key) =>
    url.searchParams.append(key, params[key])
  );

  return await (await fetch(url)).json().catch((error) => error);
}

module.exports = telegram;
