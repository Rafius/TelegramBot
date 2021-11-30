const { chromium } = require('playwright-chromium');

const url = "https://www.uoc.edu/portal/en/index.html";

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  await page.goto(url, { waitUntil: 'networkidle' });

  const homeButton = await page.$$("a.virtual-campus-link.mobile-button.hover--dynamic-hover.noscript")[0];

  page.click(homeButton);

  await page.screenshot({ path: `example.png` });

  //await browser.close();
})();