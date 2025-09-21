const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  await page.setExtraHTTPHeaders({
    'Cookie': process.env.CHARTIX_COOKIE
  });

  const url = `${process.env.AI_TRADING_URL}?symbol=${process.env.SYMBOL}&timeframe=${process.env.TIMEFRAME}&countback=${process.env.COUNTBACK}&from=${process.env.DATE_FROM}&to=${process.env.DATE_TO}&id=${process.env.CHARTIX_API_ID}`;
  console.log('Opening:', url);

  await page.goto(url, { waitUntil: 'networkidle2' });
  await page.screenshot({ path: 'screenshot.png', fullPage: true });

  await browser.close();
})();
