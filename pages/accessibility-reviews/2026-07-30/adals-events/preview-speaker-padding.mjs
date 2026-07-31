import { writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const playwrightPath = process.env.PLAYWRIGHT_MODULE_PATH;
if (!playwrightPath) throw new Error('Set PLAYWRIGHT_MODULE_PATH to Playwright index.mjs.');
const { chromium } = await import(pathToFileURL(playwrightPath));

const url = 'https://aia.tinyoakstudio.com/adals%e6%b4%bb%e5%8b%95/';
const outputDir = resolve('designer-evidence');
const browser = await chromium.launch({ channel: 'chrome', headless: true });

const measure = async page => page.evaluate(() => {
  const heading = document.querySelector('.kadence-column203_db9bb1-57 h2');
  const textCard = document.querySelector('.kadence-column203_db9bb1-57');
  const firstCard = document.querySelector('.kadence-column203_4f4300-fa');
  const rect = element => {
    const box = element.getBoundingClientRect();
    const style = getComputedStyle(element);
    return {
      selector: element.className,
      left: Math.round(box.left),
      width: Math.round(box.width),
      paddingLeft: style.paddingLeft,
      paddingRight: style.paddingRight,
    };
  };
  const ancestors = [];
  for (let element = heading; element && ancestors.length < 10; element = element.parentElement) {
    ancestors.push(rect(element));
  }
  return {
    viewportWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
    firstCard: rect(firstCard),
    textCard: rect(textCard),
    heading: rect(heading),
    ancestors,
  };
});

try {
  const page = await browser.newPage({ viewport: { width: 320, height: 900 } });
  await page.goto(url, { waitUntil: 'networkidle', timeout: 60_000 });
  const firstCard = page.locator('.kadence-column203_4f4300-fa');
  await firstCard.scrollIntoViewIfNeeded();
  const before = await measure(page);
  await firstCard.screenshot({ path: resolve(outputDir, 'speaker-padding-before-320.png') });
  await page.screenshot({ path: resolve(outputDir, 'speaker-padding-before-viewport-320.png') });

  await page.addStyleTag({
    content: `
      @media (max-width: 600px) {
        .kb-row-layout-id203_1c65f8-25 > .kt-row-column-wrap {
          padding-left: 16px !important;
          padding-right: 16px !important;
        }

        .kadence-column203_db9bb1-57 > .kt-inside-inner-col,
        .kadence-column203_fb3826-60 > .kt-inside-inner-col,
        .kadence-column203_056e1a-ad > .kt-inside-inner-col {
          padding-left: 16px !important;
          padding-right: 16px !important;
        }
      }
    `,
  });
  await page.waitForTimeout(200);
  const padding16 = await measure(page);
  await firstCard.screenshot({ path: resolve(outputDir, 'speaker-padding-16px-320.png') });
  await page.screenshot({ path: resolve(outputDir, 'speaker-padding-16px-viewport-320.png') });

  await page.addStyleTag({
    content: `
      @media (max-width: 600px) {
        .kb-row-layout-id203_1c65f8-25 > .kt-row-column-wrap {
          padding-left: 0 !important;
          padding-right: 0 !important;
        }

        .kadence-column203_db9bb1-57 > .kt-inside-inner-col,
        .kadence-column203_fb3826-60 > .kt-inside-inner-col,
        .kadence-column203_056e1a-ad > .kt-inside-inner-col {
          padding-left: 24px !important;
          padding-right: 24px !important;
        }
      }
    `,
  });
  await page.waitForTimeout(200);
  const outer0Inner24 = await measure(page);
  await firstCard.screenshot({ path: resolve(outputDir, 'speaker-padding-outer0-inner24-320.png') });
  await page.screenshot({
    path: resolve(outputDir, 'speaker-padding-outer0-inner24-viewport-320.png'),
  });

  await writeFile(
    resolve(outputDir, 'speaker-padding-16px-320.json'),
    `${JSON.stringify({ before, padding16, outer0Inner24 }, null, 2)}\n`,
    'utf8',
  );
  console.log(JSON.stringify({ before, padding16, outer0Inner24 }, null, 2));
} finally {
  await browser.close();
}
