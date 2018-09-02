const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const axios = require('axios');

const downloadPath = path.join(__dirname, '/images');
(async () => {
  const browser = await puppeteer.launch({
    headless: false, // 打开浏览器 （默认：不打开）
    executablePath: '/Applications/Chromium.app/Contents/MacOS/Chromium'
  });
  const page = await browser.newPage();

  const viewConfig = {
    width: 1000,
    height: 1000
  }
  page.setViewport(viewConfig);

  const imgUrl = 'http://image.baidu.com/search/index?tn=baiduimage&ps=1&ct=201326592&lm=-1&cl=2&nc=1&ie=utf-8&word=%E5%91%A8%E6%9D%B0%E4%BC%A6';

  await page.goto(imgUrl);

  let count = 0;
  let MIN_SIZE = 240;
  page.on('response', async function(res) {
    const headers = res.headers();
    if (headers['content-type'].includes('image') && headers['content-length'] > MIN_SIZE) {
      let buffer = await res.buffer();
      let extName = headers['content-type'].split('/')[1];
      fs.writeFile(`${downloadPath}/${count++}.${extName}`, buffer, () => {
        console.log(`${downloadPath}/${count}.${extName}`);
      })
    }
  })

  await page.evaluate(() => {
    return new Promise((resolve, reject) => {
      let pos = 0;
      let i = 0;
      let timer = setInterval(() => {
        window.scrollBy(0, 100);
        let scrollTop = document.documentElement.scrollTop;
        if (scrollTop === pos) {
          if (i > 5) {
            clearTimeout(timer);
            resolve();
          } else {
            i++;
          }
        } else {
          pos = scrollTop;
          i = 0;
        }
      }, 100);
    })
  });
  await browser.close();
})();
