import { writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const playwrightPath = process.env.PLAYWRIGHT_MODULE_PATH;
if (!playwrightPath) throw new Error('Set PLAYWRIGHT_MODULE_PATH to Playwright index.mjs.');
const { chromium } = await import(pathToFileURL(playwrightPath));

const url = 'https://aia.tinyoakstudio.com/adals%e6%b4%bb%e5%8b%95/';
const outputDir = resolve('designer-evidence');
const widths = process.env.WIDTHS
  ? process.env.WIDTHS.split(',').map(Number)
  : [320, 768, 1024, 1280, 1440, 1742, 1920];
const browser = await chromium.launch({ channel: 'chrome', headless: true });

const measure = page => page.evaluate(() => {
  const grid = document.querySelector(
    '.kb-row-layout-id203_899632-07 > .kt-row-column-wrap',
  );
  const cards = [
    '.kadence-column203_4f4300-fa',
    '.kadence-column203_93bb7a-70',
    '.kadence-column203_f3e17f-d8',
  ].map(selector => document.querySelector(selector)).filter(Boolean);
  const heading = document.querySelector('.kadence-column203_db9bb1-57 h2');
  const inner = document.querySelector('.kadence-column203_db9bb1-57 > .kt-inside-inner-col');
  const section = document.querySelector(
    '.kb-row-layout-id203_1c65f8-25 > .kt-row-column-wrap',
  );
  const box = element => {
    const rect = element.getBoundingClientRect();
    const style = getComputedStyle(element);
    return {
      left: Math.round(rect.left),
      top: Math.round(rect.top),
      width: Math.round(rect.width),
      paddingLeft: style.paddingLeft,
      paddingRight: style.paddingRight,
    };
  };
  return {
    viewportWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
    cards: cards.map(box),
    heading: box(heading),
    inner: box(inner),
    section: box(section),
    columns: [...grid.querySelectorAll('.wp-block-kadence-column')].map(element => {
      const rect = element.getBoundingClientRect();
      const style = getComputedStyle(element);
      return {
        className: element.className,
        parentClassName: element.parentElement?.className ?? '',
        height: Math.round(rect.height),
        display: style.display,
        flex: style.flex,
      };
    }),
  };
});

try {
  const results = [];
  const page = await browser.newPage({ viewport: { width: widths[0], height: 1000 } });
  await page.goto(url, { waitUntil: 'networkidle', timeout: 60_000 });
  await page.addStyleTag({
    content: `header { visibility: hidden !important; }`,
  });
  for (const width of widths) {
    await page.setViewportSize({ width, height: 1000 });
    await page.waitForTimeout(200);
    const section = page.locator('.kb-row-layout-id203_1c65f8-25');
    await section.scrollIntoViewIfNeeded();
    const before = await measure(page);
    if (!process.env.SKIP_SCREENSHOTS && !process.env.SKIP_BEFORE_SCREENSHOTS) {
      await section.screenshot({
        path: resolve(outputDir, `speaker-responsive-${width}-before.png`),
      });
    }
    const proposedStyle = await page.addStyleTag({
      content: `
        .kb-row-layout-id203_899632-07
          > .kt-row-column-wrap
          > .wp-block-kadence-column
          > .kt-inside-inner-col {
          display: flex !important;
          flex-direction: column !important;
          height: 100% !important;
        }

        .kb-row-layout-id203_899632-07 .kb-section-has-overlay {
          flex: 1 1 auto !important;
        }

        .kb-row-layout-id203_899632-07
          .kb-section-has-overlay
          > .kt-inside-inner-col {
          display: flex !important;
          flex-direction: column !important;
          flex: 1 1 auto !important;
          height: auto !important;
        }

        .kb-row-layout-id203_899632-07 .kb-section-has-overlay details {
          margin-top: auto !important;
        }

        @media (max-width: 767px) {
          .kb-row-layout-id203_1c65f8-25 > .kt-row-column-wrap {
            padding-left: 0 !important;
            padding-right: 0 !important;
          }

          .kb-row-layout-id203_899632-07 > .kt-row-column-wrap {
            grid-template-columns: minmax(0, 1fr) !important;
            max-width: 520px !important;
            margin-left: auto !important;
            margin-right: auto !important;
            justify-items: center !important;
          }

          .kadence-column203_db9bb1-57 > .kt-inside-inner-col,
          .kadence-column203_fb3826-60 > .kt-inside-inner-col,
          .kadence-column203_056e1a-ad > .kt-inside-inner-col {
            padding-left: 24px !important;
            padding-right: 24px !important;
          }
        }

        @media (min-width: 768px) and (max-width: 1024px) {
          .kb-row-layout-id203_1c65f8-25 > .kt-row-column-wrap {
            padding-left: 0 !important;
            padding-right: 0 !important;
          }

          .kb-row-layout-id203_899632-07 > .kt-row-column-wrap {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
            max-width: 976px !important;
            margin-left: auto !important;
            margin-right: auto !important;
            column-gap: 24px !important;
          }

          .kadence-column203_db9bb1-57 > .kt-inside-inner-col,
          .kadence-column203_fb3826-60 > .kt-inside-inner-col,
          .kadence-column203_056e1a-ad > .kt-inside-inner-col {
            padding-left: 24px !important;
            padding-right: 24px !important;
          }
        }

        @media (min-width: 1025px) {
          .kb-row-layout-id203_899632-07 > .kt-row-column-wrap {
            grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
            column-gap: 24px !important;
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
    const proposed = await measure(page);
    if (!process.env.SKIP_SCREENSHOTS) {
      await section.screenshot({
        path: resolve(outputDir, `speaker-responsive-${width}-proposed.png`),
      });
    }
    results.push({ width, before, proposed });
    await proposedStyle.evaluate(element => element.remove());
  }
  await page.close();
  await writeFile(
    resolve(outputDir, 'speaker-responsive-proposal.json'),
    `${JSON.stringify(results, null, 2)}\n`,
    'utf8',
  );
  console.log(JSON.stringify(results, null, 2));
} finally {
  await browser.close();
}
