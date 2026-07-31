import { writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const playwrightPath = process.env.PLAYWRIGHT_MODULE_PATH;
if (!playwrightPath) throw new Error('Set PLAYWRIGHT_MODULE_PATH to Playwright index.mjs.');
const { chromium } = await import(pathToFileURL(playwrightPath));

const report = resolve('event-page-0730-check.html');
const widths = [320, 768, 1024, 1280, 1440, 1742, 1920];
const results = [];
const browser = await chromium.launch({ channel: 'chrome', headless: true });

try {
  const page = await browser.newPage();
  await page.goto(pathToFileURL(report).href);
  for (const width of widths) {
    await page.setViewportSize({ width, height: 900 });
    const result = await page.evaluate(() => {
      const root = document.documentElement;
      const visible = element => {
        const style = getComputedStyle(element);
        const rect = element.getBoundingClientRect();
        return style.display !== 'none' && style.visibility !== 'hidden' && rect.width > 0 && rect.height > 0;
      };
      const elements = [...document.querySelectorAll('body *')].filter(visible);
      return {
        clientWidth: root.clientWidth,
        scrollWidth: root.scrollWidth,
        offenders: elements.filter(element => {
          const rect = element.getBoundingClientRect();
          return rect.left < -1 || rect.right > root.clientWidth + 1;
        }).map(element => ({
          tag: element.tagName.toLowerCase(),
          className: String(element.className || '').slice(0, 80),
          left: Math.round(element.getBoundingClientRect().left),
          right: Math.round(element.getBoundingClientRect().right),
        })).slice(0, 12),
        forbiddenFonts: elements.filter(element =>
          /PMingLiU|MingLiU/i.test(getComputedStyle(element).fontFamily)
        ).map(element => element.tagName.toLowerCase()).slice(0, 12),
        narrowCards: elements.filter(element =>
          element.matches('.finding,.pass,.evidence,.outline-card,.verdict > section') &&
          element.getBoundingClientRect().width < Math.min(288, root.clientWidth - 24)
        ).map(element => ({
          className: String(element.className || ''),
          width: Math.round(element.getBoundingClientRect().width),
        })).slice(0, 12),
        semantics: {
          h1Count: document.querySelectorAll('h1').length,
          lang: document.documentElement.lang,
          imagesMissingAlt: [...document.images].filter(image => !image.hasAttribute('alt')).length,
          emptyLinks: [...document.querySelectorAll('a')].filter(link => !link.getAttribute('href')).length,
          skipTargetExists: Boolean(document.querySelector(document.querySelector('.skip')?.getAttribute('href') || '#missing')),
        },
      };
    });
    results.push({ width, ...result });
    if (
      result.scrollWidth > result.clientWidth ||
      result.offenders.length ||
      result.forbiddenFonts.length ||
      result.narrowCards.length ||
      result.semantics.h1Count !== 1 ||
      result.semantics.lang !== 'zh-TW' ||
      result.semantics.imagesMissingAlt ||
      result.semantics.emptyLinks ||
      !result.semantics.skipTargetExists
    ) {
      throw new Error(`${width}px layout gate failed: ${JSON.stringify(result)}`);
    }
    await page.screenshot({ path: `designer-report-${width}.png`, fullPage: true });
  }
} finally {
  await browser.close();
}

await writeFile('designer-report-layout-validation.json', `${JSON.stringify(results, null, 2)}\n`);
console.log(`Validated designer report at ${widths.length} widths.`);
