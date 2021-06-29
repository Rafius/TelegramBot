const fetch = require("node-fetch");

async function telegram(msn = ''){
  const baseURL = 'https://api.telegram.org/bot';
  const token = process.env.token;
  const chat_id = process.env.chatId;
  const parse_mode= 'MarkdownV2';
  const endPoint = 'sendMessage'

  const url = new URL(`${baseURL}${token}/${endPoint}`);
  const params = {
    chat_id: chat_id,
    parse_mode: parse_mode,
    text: msn
  };

  Object.keys(params).forEach(key => url.searchParams.append(key, params[key]))
  console.log(url)

  return await (await fetch(url)).json().catch(error => error);
}

module.exports = telegram