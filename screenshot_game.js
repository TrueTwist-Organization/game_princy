const puppeteer = require('puppeteer');

(async () => {
  try {
    const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });

    page.on('console', msg => console.log('BROWSER LOG:', msg.text()));
    page.on('pageerror', error => console.log('BROWSER ERROR:', error.message));

    console.log("Navigating to com-tencent-ig.php...");
    await page.goto('http://127.0.0.1:8080/explore/game/com-tencent-ig.php', { waitUntil: 'networkidle2' });
    
    console.log("Simulating click on body for user gesture...");
    await page.click('body');
    
    console.log("Waiting 8 seconds for rewarded ad to load and pop up...");
    await new Promise(r => setTimeout(r, 8000));
    
    const screenshotPath = 'C:\\Users\\Admin\\.gemini\\antigravity-ide\\brain\\495aeec7-812a-4b94-9399-8e4994df51f7\\local_screenshot_php_click.png';
    console.log("Taking screenshot...");
    await page.screenshot({ path: screenshotPath });
    console.log("Screenshot saved to:", screenshotPath);
    
    await browser.close();
  } catch(e) {
    console.error("Puppeteer error:", e);
  }
})();
