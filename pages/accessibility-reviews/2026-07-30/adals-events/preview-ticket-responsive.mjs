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

const box = element => {
  const rect = element.getBoundingClientRect();
  const style = getComputedStyle(element);
  return {
    left: Math.round(rect.left),
    top: Math.round(rect.top),
    width: Math.round(rect.width),
    height: Math.round(rect.height),
    paddingLeft: style.paddingLeft,
    paddingRight: style.paddingRight,
    color: style.color,
  };
};

const measure = page => page.evaluate(boxSource => {
  const box = new Function(`return (${boxSource})`)();
  const grid = document.querySelector('.kb-row-layout-id203_7e4fd1-5d > .kt-row-column-wrap');
  const cards = [...grid.children];
  return {
    viewportWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
    grid: {
      ...box(grid),
      columns: getComputedStyle(grid).gridTemplateColumns,
      gap: getComputedStyle(grid).gap,
    },
    cards: cards.map(card => {
      const inner = card.firstElementChild;
      const title = inner.querySelector('h3');
      const price = inner.children[2];
      const label = inner.querySelector('h4');
      const listItem = inner.querySelector('li');
      const button = inner.querySelector('.wp-block-kadence-advancedbtn');
      return {
        title: title.textContent.trim().replace(/\s+/g, ' '),
        card: box(card),
        inner: box(inner),
        titleBox: box(title),
        priceBox: box(price),
        labelBox: box(label),
        listItemBox: box(listItem),
        buttonBox: box(button),
      };
    }),
  };
}, box.toString());

const proposedCss = `
  .kb-row-layout-id203_7e4fd1-5d
    > .kt-row-column-wrap
    > .wp-block-kadence-column
    > .kt-inside-inner-col {
    display: flex !important;
    flex-direction: column !important;
    height: 100% !important;
    padding-left: 24px !important;
    padding-right: 24px !important;
  }

  .kb-row-layout-id203_7e4fd1-5d h3 {
    min-block-size: 3.5em;
  }

  .kb-row-layout-id203_7e4fd1-5d h4 {
    color: #4a5568 !important;
  }

  .kb-row-layout-id203_7e4fd1-5d .wp-block-kadence-advancedbtn {
    margin-top: auto !important;
  }

  @media (max-width: 767px) {
    .kb-row-layout-id203_7e4fd1-5d > .kt-row-column-wrap {
      grid-template-columns: minmax(0, 1fr) !important;
      gap: 24px !important;
    }

    .kb-row-layout-id203_7e4fd1-5d h3 {
      min-block-size: 0;
    }
  }

  @media (min-width: 768px) and (max-width: 1024px) {
    .kb-row-layout-id203_c025a4-7d > .kt-row-column-wrap {
      max-width: 976px !important;
      margin-left: auto !important;
      margin-right: auto !important;
    }

    .kb-row-layout-id203_7e4fd1-5d > .kt-row-column-wrap {
      grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
      gap: 24px !important;
    }
  }

  @media (min-width: 1025px) {
    .kb-row-layout-id203_c025a4-7d > .kt-row-column-wrap {
      width: calc(100% - 48px) !important;
      max-width: 1648px !important;
    }

    .kb-row-layout-id203_7e4fd1-5d > .kt-row-column-wrap {
      grid-template-columns: repeat(4, minmax(0, 1fr)) !important;
      gap: 16px !important;
    }

    .kb-row-layout-id203_7e4fd1-5d
      > .kt-row-column-wrap
      > .wp-block-kadence-column
      > .kt-inside-inner-col {
      padding-left: 16px !important;
      padding-right: 16px !important;
    }
  }
`;

try {
  const page = await browser.newPage({ viewport: { width: widths[0], height: 1000 } });
  await page.goto(url, { waitUntil: 'networkidle', timeout: 60_000 });
  await page.addStyleTag({ content: 'header { visibility: hidden !important; }' });
  const section = page.locator('.kb-row-layout-id203_c025a4-7d');
  const results = [];

  for (const width of widths) {
    await page.setViewportSize({ width, height: 1000 });
    await page.waitForTimeout(200);
    await section.scrollIntoViewIfNeeded();
    const before = await measure(page);
    if (!process.env.SKIP_SCREENSHOTS) {
      await section.screenshot({
        path: resolve(outputDir, `ticket-responsive-${width}-before.png`),
      });
    }

    const style = await page.addStyleTag({ content: proposedCss });
    await page.waitForTimeout(200);
    const proposed = await measure(page);
    if (!process.env.SKIP_SCREENSHOTS) {
      await section.screenshot({
        path: resolve(outputDir, `ticket-responsive-${width}-proposed.png`),
      });
    }
    results.push({ width, before, proposed });
    await style.evaluate(element => element.remove());
  }

  await writeFile(
    resolve(outputDir, 'ticket-responsive-proposal.json'),
    `${JSON.stringify(results, null, 2)}\n`,
    'utf8',
  );
  console.log(JSON.stringify(results.map(result => ({
    width: result.width,
    before: {
      columns: result.before.grid.columns,
      cardWidth: result.before.cards[0].card.width,
      textWidth: result.before.cards[0].listItemBox.width,
      priceTops: result.before.cards.map(card => card.priceBox.top),
      buttonTops: result.before.cards.map(card => card.buttonBox.top),
    },
    proposed: {
      columns: result.proposed.grid.columns,
      cardWidth: result.proposed.cards[0].card.width,
      textWidth: result.proposed.cards[0].listItemBox.width,
      priceTops: result.proposed.cards.map(card => card.priceBox.top),
      buttonTops: result.proposed.cards.map(card => card.buttonBox.top),
      scrollWidth: result.proposed.scrollWidth,
    },
  })), null, 2));
  await page.close();
} finally {
  await browser.close();
}
