import { writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const playwrightPath = process.env.PLAYWRIGHT_MODULE_PATH;
if (!playwrightPath) throw new Error('Set PLAYWRIGHT_MODULE_PATH to Playwright index.mjs.');
const { chromium } = await import(pathToFileURL(playwrightPath));

const url = 'https://aia.tinyoakstudio.com/adals%e6%b4%bb%e5%8b%95/';
const widths = [320, 768, 1024, 1280, 1440, 1742, 1920];
const results = [];
const browser = await chromium.launch({ channel: 'chrome', headless: true });

try {
  for (const width of widths) {
    const page = await browser.newPage({ viewport: { width, height: 900 } });
    await page.goto(url, { waitUntil: 'networkidle', timeout: 60_000 });
    await page.locator('.kb-row-layout-id203_899632-07').scrollIntoViewIfNeeded();

    const result = await page.evaluate(() => {
      const grid = document.querySelector('.kb-row-layout-id203_899632-07 > .kt-row-column-wrap');
      const cards = [...grid.children].filter(element =>
        element.classList.contains('wp-block-kadence-column')
      );
      const textCards = [
        document.querySelector('.kadence-column203_db9bb1-57'),
        document.querySelector('.kadence-column203_fb3826-60'),
        document.querySelector('.kadence-column203_056e1a-ad'),
      ];
      const rect = element => {
        const box = element.getBoundingClientRect();
        return {
          left: Math.round(box.left * 10) / 10,
          top: Math.round(box.top * 10) / 10,
          width: Math.round(box.width * 10) / 10,
          height: Math.round(box.height * 10) / 10,
          right: Math.round(box.right * 10) / 10,
        };
      };
      const textMetrics = element => {
        const style = getComputedStyle(element);
        const box = element.getBoundingClientRect();
        const lineHeight = Number.parseFloat(style.lineHeight);
        return {
          tag: element.tagName.toLowerCase(),
          text: element.textContent.trim().replace(/\s+/g, ' ').slice(0, 120),
          width: Math.round(box.width * 10) / 10,
          height: Math.round(box.height * 10) / 10,
          fontSize: style.fontSize,
          lineHeight: style.lineHeight,
          approximateLines: Number.isFinite(lineHeight)
            ? Math.round((box.height / lineHeight) * 10) / 10
            : null,
        };
      };

      return {
        viewport: {
          clientWidth: document.documentElement.clientWidth,
          scrollWidth: document.documentElement.scrollWidth,
        },
        grid: {
          ...rect(grid),
          display: getComputedStyle(grid).display,
          columns: getComputedStyle(grid).gridTemplateColumns,
          gap: getComputedStyle(grid).gap,
        },
        cards: cards.map((card, index) => ({
          index: index + 1,
          ...rect(card),
          textCard: rect(textCards[index]),
          heading: textMetrics(textCards[index].querySelector('h2')),
          role: textMetrics(textCards[index].querySelector('h2 + div')),
          bio: textMetrics(textCards[index].querySelector('h2 + div + div')),
          disclosure: textMetrics(textCards[index].querySelector('summary')),
          link: textMetrics(textCards[index].querySelector('a')),
        })),
      };
    });

    results.push({ width, ...result });
    if (width === 320 || width === 768) {
      await page.evaluate(() => scrollTo(0, 0));
      await page.waitForTimeout(200);
      await page.screenshot({
        fullPage: true,
        path: resolve(`designer-evidence/site-${width}.png`),
      });
      await page.locator('.kb-row-layout-id203_899632-07').scrollIntoViewIfNeeded();
      await page.waitForTimeout(200);
      await page.screenshot({
        path: resolve(`designer-evidence/speakers-${width}.png`),
      });
      await page.locator('.kb-row-layout-id203_899632-07').screenshot({
        path: resolve(`speaker-live-${width}.png`),
      });
    }
    await page.close();
  }
} finally {
  await browser.close();
}

await writeFile(
  resolve('speaker-responsive-live.json'),
  `${JSON.stringify(results, null, 2)}\n`,
  'utf8',
);
console.log(JSON.stringify(results, null, 2));
