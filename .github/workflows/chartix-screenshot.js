const { chromium } = require('playwright'); // npm install playwright

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  // ست کردن کوکی لاگین (اگر لازم باشه)
  await page.context().addCookies([
    {
      name: 'session',
      value: process.env.CHARTIX_COOKIE,
      domain: 'chartix.ir',
      path: '/',
      httpOnly: false,
      secure: true
    }
  ]);

  await page.goto('https://chartix.ir');

  // تغییر نماد، تایم‌فریم و بازه تاریخی (جایگزین با Selectorهای واقعی)
  await page.fill('#symbol-input', process.env.SYMBOL);
  await page.keyboard.press('Enter');
  await page.click(`#timeframe-${process.env.TIMEFRAME}`);
  
  // کمی صبر برای لود شدن کامل
  await page.waitForTimeout(3000);

  // گرفتن اسکرین‌شات
  await page.screenshot({ path: 'chart.png', fullPage: true });

  // ارسال به ماژول ai_trading
  const fs = require('fs');
  const axios = require('axios');
  const imgData = fs.readFileSync('chart.png');
  await axios.post(process.env.AI_TRADING_URL, imgData, {
    headers: { 'Content-Type': 'image/png' }
  });

  await browser.close();
})();
