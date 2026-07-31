import { writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const playwrightPath = process.env.PLAYWRIGHT_MODULE_PATH;
if (!playwrightPath) throw new Error('Set PLAYWRIGHT_MODULE_PATH to Playwright index.mjs.');
const { chromium } = await import(pathToFileURL(playwrightPath));

const url = 'https://aia.tinyoakstudio.com/';
const widths = [320, 768, 1024, 1280, 1440, 1742, 1920];
const aboutHeadings = ['當生活幾乎', '許多人因身體狀況', '打破現有的侷限'];
const results = [];
const browser = await chromium.launch({ channel: 'chrome', headless: true });

const round = value => Math.round(value * 10) / 10;

try {
  for (const width of widths) {
    const page = await browser.newPage({ viewport: { width, height: 1000 } });
    await page.goto(url, { waitUntil: 'networkidle', timeout: 60_000 });
    await page.evaluate(() => scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(300);
    await page.evaluate(() => scrollTo(0, 0));
    await page.waitForTimeout(150);

    const result = await page.evaluate(({ aboutHeadings }) => {
      const visible = element => {
        const style = getComputedStyle(element);
        const rect = element.getBoundingClientRect();
        return style.display !== 'none' && style.visibility !== 'hidden' &&
          rect.width > 0 && rect.height > 0;
      };
      const rect = element => {
        const box = element.getBoundingClientRect();
        return {
          x: Math.round(box.x * 10) / 10,
          y: Math.round(box.y * 10) / 10,
          width: Math.round(box.width * 10) / 10,
          height: Math.round(box.height * 10) / 10,
          bottom: Math.round(box.bottom * 10) / 10,
        };
      };
      const describe = element => {
        const style = getComputedStyle(element);
        return {
          ...rect(element),
          display: style.display,
          position: style.position,
          padding: style.padding,
          margin: style.margin,
          minHeight: style.minHeight,
          gap: style.gap,
          gridTemplateColumns: style.gridTemplateColumns,
          alignItems: style.alignItems,
          justifyContent: style.justifyContent,
          objectFit: style.objectFit,
          backgroundImage: style.backgroundImage === 'none' ? 'none' : style.backgroundImage,
          borderRadius: style.borderRadius,
        };
      };
      const headings = [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')];
      const aboutRows = aboutHeadings.map(text => {
        const heading = headings.find(element => element.textContent.includes(text));
        const row = heading.closest('.kb-row-layout-wrap');
        const grid = row.querySelector(':scope > .kt-row-column-wrap');
        return {
          heading: heading.textContent.trim().replace(/\s+/g, ' '),
          rowClass: row.className,
          grid: describe(grid),
          cells: [...grid.children].map(cell => {
            const inner = cell.querySelector(':scope > .kt-inside-inner-col');
            const image = cell.querySelector('img');
            return {
              className: cell.className,
              cell: describe(cell),
              inner: inner ? describe(inner) : null,
              image: image ? describe(image) : null,
              heading: cell.querySelector('h3') ? describe(cell.querySelector('h3')) : null,
              paragraph: cell.querySelector('p') ? describe(cell.querySelector('p')) : null,
              text: cell.textContent.trim().replace(/\s+/g, ' ').slice(0, 80),
            };
          }),
        };
      });
      const allVisible = [...document.querySelectorAll('body *')].filter(visible);
      const longText = allVisible.filter(element => {
        const text = element.textContent.trim().replace(/\s+/g, ' ');
        return element.childElementCount === 0 && text.length >= 45;
      });
      const emptyLinks = [...document.querySelectorAll('a')].filter(link =>
        !link.getAttribute('href') || link.getAttribute('href') === '#'
      );
      const fauxControls = [...document.querySelectorAll('.button,.kb-button,[class*="btn"]')]
        .filter(element =>
          !element.closest('a,button,[role="button"]') &&
          element.textContent.trim().length > 0
        );
      return {
        title: document.title,
        lang: document.documentElement.lang,
        viewport: {
          clientWidth: document.documentElement.clientWidth,
          scrollWidth: document.documentElement.scrollWidth,
          scrollHeight: document.documentElement.scrollHeight,
        },
        headings: headings.map(element => ({
          level: Number(element.tagName.slice(1)),
          text: element.textContent.trim().replace(/\s+/g, ' '),
        })),
        landmarks: {
          main: document.querySelectorAll('main').length,
          nav: document.querySelectorAll('nav').length,
          footer: document.querySelectorAll('footer').length,
          skipHref: document.querySelector('a[href^="#"]')?.getAttribute('href') || null,
          skipTarget: Boolean(document.querySelector(
            document.querySelector('a[href^="#"]')?.getAttribute('href') || '#missing'
          )),
        },
        images: {
          total: document.images.length,
          missingAlt: [...document.images].filter(image => !image.hasAttribute('alt')).map(image => image.src),
          emptyAlt: [...document.images].filter(image => image.getAttribute('alt') === '').length,
        },
        emptyLinks: emptyLinks.map(link => ({
          text: link.textContent.trim().replace(/\s+/g, ' '),
          ariaLabel: link.getAttribute('aria-label'),
          href: link.getAttribute('href'),
        })),
        fauxControls: fauxControls.map(element => ({
          tag: element.tagName.toLowerCase(),
          text: element.textContent.trim().replace(/\s+/g, ' '),
          className: element.className,
        })),
        aboutRows,
        narrowText: longText.filter(element =>
          element.getBoundingClientRect().width < 240
        ).map(element => ({
          tag: element.tagName.toLowerCase(),
          text: element.textContent.trim().replace(/\s+/g, ' ').slice(0, 120),
          width: Math.round(element.getBoundingClientRect().width),
        })).slice(0, 30),
        horizontalOffenders: allVisible.filter(element => {
          const box = element.getBoundingClientRect();
          return box.left < -1 || box.right > document.documentElement.clientWidth + 1;
        }).map(element => ({
          tag: element.tagName.toLowerCase(),
          className: String(element.className).slice(0, 100),
          box: rect(element),
        })).slice(0, 20),
      };
    }, { aboutHeadings });

    const focusTrace = [];
    if (width === 320 || width === 1440) {
      for (let index = 0; index < 35; index += 1) {
        await page.keyboard.press('Tab');
        focusTrace.push(await page.evaluate(() => {
          const element = document.activeElement;
          const box = element.getBoundingClientRect();
          return {
            tag: element.tagName.toLowerCase(),
            text: (element.getAttribute('aria-label') || element.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 100),
            href: element.getAttribute('href'),
            rect: {
              x: Math.round(box.x),
              y: Math.round(box.y),
              width: Math.round(box.width),
              height: Math.round(box.height),
            },
          };
        }));
      }
    }

    results.push({ width, ...result, focusTrace });
    await page.screenshot({
      fullPage: true,
      path: resolve(`designer-evidence/homepage-${width}.png`),
    });
    if (width === 320 || width === 768 || width === 1440 || width === 1742) {
      await page.locator('.kadence-column6_19bb5b-48').scrollIntoViewIfNeeded();
      await page.waitForTimeout(200);
      await page.screenshot({
        path: resolve(`designer-evidence/about-${width}.png`),
      });
    }
    await page.close();
  }
} finally {
  await browser.close();
}

await writeFile(
  resolve('homepage-live-audit.json'),
  `${JSON.stringify(results, null, 2)}\n`,
  'utf8',
);

const summary = results.map(result => ({
  width: result.width,
  clientWidth: result.viewport.clientWidth,
  scrollWidth: result.viewport.scrollWidth,
  scrollHeight: result.viewport.scrollHeight,
  narrowTextCount: result.narrowText.length,
  offenderCount: result.horizontalOffenders.length,
  aboutRows: result.aboutRows.map(row => ({
    heading: row.heading.slice(0, 18),
    grid: [row.grid.width, row.grid.height],
    cells: row.cells.map(cell => [cell.cell.width, cell.cell.height, cell.image?.height || null]),
  })),
}));
console.log(JSON.stringify(summary, null, 2));
