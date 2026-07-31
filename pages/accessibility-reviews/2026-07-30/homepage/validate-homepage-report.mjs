import { writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const playwrightPath = process.env.PLAYWRIGHT_MODULE_PATH;
if (!playwrightPath) throw new Error('Set PLAYWRIGHT_MODULE_PATH to Playwright index.mjs.');
const { chromium } = await import(pathToFileURL(playwrightPath));

const widths = [320, 768, 1024, 1280, 1440, 1742, 1920];
const report = resolve('homepage-0730-review.html');
const results = [];
const browser = await chromium.launch({ channel: 'chrome', headless: true });

try {
  const page = await browser.newPage();
  await page.goto(pathToFileURL(report).href);
  for (const width of widths) {
    await page.setViewportSize({ width, height: 900 });
    const result = await page.evaluate(() => {
      const root = document.documentElement;
      const rgb = value => (value.match(/\d+(?:\.\d+)?/g) || []).slice(0, 3).map(Number);
      const luminance = value => {
        const channels = rgb(value).map(channel => {
          const normalized = channel / 255;
          return normalized <= 0.04045
            ? normalized / 12.92
            : ((normalized + 0.055) / 1.055) ** 2.4;
        });
        return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
      };
      const contrast = (foreground, background) => {
        const lighter = Math.max(luminance(foreground), luminance(background));
        const darker = Math.min(luminance(foreground), luminance(background));
        return (lighter + 0.05) / (darker + 0.05);
      };
      const visible = element => {
        const style = getComputedStyle(element);
        const box = element.getBoundingClientRect();
        return style.display !== 'none' && style.visibility !== 'hidden' && box.width > 0 && box.height > 0;
      };
      const elements = [...document.querySelectorAll('body *')].filter(visible);
      const codeBlock = document.querySelector('.implementation pre code');
      const codeForeground = getComputedStyle(codeBlock).color;
      const codeBackground = getComputedStyle(codeBlock.closest('pre')).backgroundColor;
      return {
        clientWidth: root.clientWidth,
        scrollWidth: root.scrollWidth,
        codeBlockContrast: {
          foreground: codeForeground,
          background: codeBackground,
          ratio: Number(contrast(codeForeground, codeBackground).toFixed(2)),
        },
        offenders: elements.filter(element => {
          const box = element.getBoundingClientRect();
          return box.left < -1 || box.right > root.clientWidth + 1;
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
          element.matches('.finding,.pass,.evidence,.summary,.implementation,.method') &&
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
      result.codeBlockContrast.ratio < 4.5 ||
      result.offenders.length ||
      result.forbiddenFonts.length ||
      result.narrowCards.length ||
      result.semantics.h1Count !== 1 ||
      result.semantics.lang !== 'zh-Hant' ||
      result.semantics.imagesMissingAlt ||
      result.semantics.emptyLinks ||
      !result.semantics.skipTargetExists
    ) {
      throw new Error(`${width}px layout gate failed: ${JSON.stringify(result)}`);
    }
    await page.screenshot({ path: `homepage-report-${width}.png`, fullPage: true });
  }
} finally {
  await browser.close();
}

await writeFile('homepage-report-layout-validation.json', `${JSON.stringify(results, null, 2)}\n`);
console.log(`Validated homepage report at ${widths.length} widths.`);
