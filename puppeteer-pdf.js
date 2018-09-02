const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    // headless: false,
    executablePath: '/Applications/Chromium.app/Contents/MacOS/Chromium'
  });
  const page = await browser.newPage();
  await page.goto('http://es6.ruanyifeng.com/');
  await page.waitFor(2000);
  let aTags = await page.evaluate(() => {
    let as = [...document.querySelectorAll('ol li a')];
    return as.map(a => ({
      href: a.href.trim(),
      name: a.text
    }))
  });
  await page.emulateMedia('screen');
  await page.pdf({path: `./es6-pdf/${aTags[0].name}.pdf`});
  page.close();

  for (let i = 1; i < aTags.length; i++) {
    let page = await browser.newPage();
    let a = aTags[i];
    await page.goto(a.href);
    await page.waitFor(2000);
    await page.pdf({path: `./es6-pdf/${a.name}.pdf`});
    page.close();
  }
  browser.close();
})();
