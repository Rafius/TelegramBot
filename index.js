const { chromium } = require("playwright-chromium");

const url =
  "https://cv.uoc.edu/webapps/cas/login?service=https%3A%2F%2Fid-provider.uoc.edu%2Fidp%2Fauthn%2Fexternal%2Flogin.jsp%3Fconversation%3De1s1&renew=true";

(async () => {
  const browser = await chromium.launch({ headless: false });
  //await browser.setViewport({ width: 1920, height: 1080 });
  const page = await browser.newPage();

  await page.goto(url, { waitUntil: "networkidle" });

  // Wait for elements to by visible and click the fist one
  // await page.waitForSelector('span.icon.icon--campus', { visible: true });
  // await page.click('span.icon.icon--campus');

  // get input by id and fill it with the value
  //await page.waitForSelector('#fm1', { visible: true });

  const username = process.env.USERNAME;
  const password = process.env.PASSWORD;
  await page.fill("#username", username);
  await page.fill("#password", password);
  await page.click("button#submitButton");

  await page.click("a.virtual-campus-link.hover--dynamic-hover");

  // await page.locator((homeButton[0]).click());
  //await page.click(homeButton[0]);

  // await page.screenshot({ path: `example.png` });

  //await browser.close();
})();
