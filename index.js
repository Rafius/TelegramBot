require("dotenv").config();
const { chromium } = require("playwright-chromium");

/*const url =
  "https://cv.uoc.edu/webapps/cas/login?service=https%3A%2F%2Fid-provider.uoc.edu%2Fidp%2Fauthn%2Fexternal%2Flogin.jsp%3Fconversation%3De1s1&renew=true";
*/
const url = "https://www.uoc.edu/portal/es/index_es.html";

(async () => {
  const browser = await chromium.launch({
    headless: false,
    defaultViewport: null
  });
  const page = await browser.newPage();

  await page.goto(url, { waitUntil: "networkidle" });

  await page.click(
    "#main-nav-menu > ul > li.col-xs-1.virtual-campus-button-container > a"
  );

  await page.waitForSelector("#fm1", { visible: true });

  const user = process.env.USER;
  const password = process.env.PASSWORD;

  await page.fill("#username", user);
  await page.fill("#password", password);
  await page.click("button#submitButton");

  await page.waitForTimeout(3000);
  await page.click("#dock_nav > li:nth-child(3)");

  //await browser.close();
})();
