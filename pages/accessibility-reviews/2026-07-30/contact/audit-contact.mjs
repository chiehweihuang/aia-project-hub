import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const playwrightPath = process.env.PLAYWRIGHT_MODULE_PATH;
if (!playwrightPath) throw new Error('Set PLAYWRIGHT_MODULE_PATH to Playwright index.mjs.');
const { chromium } = await import(pathToFileURL(playwrightPath));

const url = 'https://aia.tinyoakstudio.com/%e8%81%af%e7%b9%ab/';
const widths = [320, 768, 1024, 1280, 1440, 1742, 1920];
const evidenceDir = resolve('designer-evidence');
await mkdir(evidenceDir, { recursive: true });

const browser = await chromium.launch({ channel: 'chrome', headless: true });
const results = [];

try {
  const page = await browser.newPage({ viewport: { width: widths[0], height: 1000 } });
  await page.goto(url, { waitUntil: 'networkidle', timeout: 60_000 });

  for (const width of widths) {
    await page.setViewportSize({ width, height: 1000 });
    await page.waitForTimeout(200);

    const result = await page.evaluate(() => {
      const visible = element => {
        const style = getComputedStyle(element);
        const rect = element.getBoundingClientRect();
        return style.display !== 'none' && style.visibility !== 'hidden' &&
          rect.width > 0 && rect.height > 0;
      };
      const rect = element => {
        const box = element.getBoundingClientRect();
        return {
          x: Math.round(box.x),
          y: Math.round(box.y),
          width: Math.round(box.width),
          height: Math.round(box.height),
          right: Math.round(box.right),
        };
      };
      const form = document.forms[0];
      const headings = [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')];
      const fields = [...form.elements].filter(element => element.type !== 'hidden');
      const allVisible = [...document.querySelectorAll('body *')].filter(visible);
      const emptyLinks = [...document.querySelectorAll('a')].filter(link =>
        !link.getAttribute('href') || link.getAttribute('href') === '#'
      );
      const focusables = [...document.querySelectorAll(
        'a[href],button,input:not([type="hidden"]),select,textarea,[tabindex]:not([tabindex="-1"])'
      )].filter(visible);
      const formRect = rect(form);
      const heading = headings.find(element => element.textContent.includes('聯繫我們'));

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
        mainHeading: heading ? rect(heading) : null,
        form: {
          rect: formRect,
          fields: fields.map(element => ({
            tag: element.tagName.toLowerCase(),
            type: element.type,
            id: element.id,
            label: element.labels?.[0]?.textContent.trim().replace(/\s+/g, ' ') || '',
            required: element.required,
            autocomplete: element.autocomplete,
            describedby: element.getAttribute('aria-describedby'),
            invalid: element.getAttribute('aria-invalid'),
            rect: rect(element),
          })),
        },
        images: [...document.images].map(image => ({
          alt: image.getAttribute('alt'),
          src: image.currentSrc || image.src,
          rect: rect(image),
        })),
        emptyLinks: emptyLinks.map(link => ({
          text: link.textContent.trim(),
          ariaLabel: link.getAttribute('aria-label'),
          href: link.getAttribute('href'),
        })),
        focusables: focusables.map(element => ({
          tag: element.tagName.toLowerCase(),
          text: (element.getAttribute('aria-label') || element.textContent || '').trim()
            .replace(/\s+/g, ' ').slice(0, 80),
          type: element.type || null,
          href: element.getAttribute('href'),
          rect: rect(element),
        })),
        smallTargets: focusables.filter(element => {
          const box = element.getBoundingClientRect();
          return box.width < 24 || box.height < 24;
        }).map(element => ({
          tag: element.tagName.toLowerCase(),
          text: (element.getAttribute('aria-label') || element.textContent || '').trim()
            .replace(/\s+/g, ' ').slice(0, 80),
          rect: rect(element),
        })),
        horizontalOffenders: allVisible.filter(element => {
          const box = element.getBoundingClientRect();
          return box.left < -1 || box.right > document.documentElement.clientWidth + 1;
        }).map(element => ({
          tag: element.tagName.toLowerCase(),
          className: String(element.className).slice(0, 100),
          rect: rect(element),
        })).slice(0, 30),
      };
    });

    const textSpacingStyle = await page.addStyleTag({
      content: `
        * {
          line-height: 1.5 !important;
          letter-spacing: .12em !important;
          word-spacing: .16em !important;
        }
        p { margin-bottom: 2em !important; }
      `,
    });
    result.textSpacing = await page.evaluate(() => ({
      clientWidth: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
      scrollHeight: document.documentElement.scrollHeight,
    }));
    await textSpacingStyle.evaluate(element => element.remove());

    const focusTrace = [];
    if (width === 320 || width === 1440) {
      await page.evaluate(() => document.activeElement?.blur());
      for (let index = 0; index < 24; index += 1) {
        await page.keyboard.press('Tab');
        focusTrace.push(await page.evaluate(() => {
          const element = document.activeElement;
          const box = element.getBoundingClientRect();
          const style = getComputedStyle(element);
          return {
            tag: element.tagName.toLowerCase(),
            text: (element.getAttribute('aria-label') || element.textContent || '').trim()
              .replace(/\s+/g, ' ').slice(0, 100),
            type: element.type || null,
            href: element.getAttribute('href'),
            rect: {
              x: Math.round(box.x),
              y: Math.round(box.y),
              width: Math.round(box.width),
              height: Math.round(box.height),
            },
            focusStyle: {
              outline: style.outline,
              outlineOffset: style.outlineOffset,
              boxShadow: style.boxShadow,
            },
          };
        }));
      }
    }

    results.push({ width, ...result, focusTrace });
    await page.screenshot({
      fullPage: true,
      path: resolve(evidenceDir, `contact-${width}.png`),
    });
    const hiddenHeader = await page.addStyleTag({
      content: 'header { visibility: hidden !important; }',
    });
    await page.locator('main').screenshot({
      path: resolve(evidenceDir, `contact-main-${width}.png`),
    });
    await hiddenHeader.evaluate(element => element.remove());
    await page.locator('.kb-row-layout-id215_07ca60-be').screenshot({
      path: resolve(evidenceDir, `contact-form-${width}.png`),
    });
    if (width === 320 || width === 1440) {
      await page.locator('footer').screenshot({
        path: resolve(evidenceDir, `contact-footer-${width}.png`),
      });
    }
  }
  await page.close();
} finally {
  await browser.close();
}

await writeFile(
  resolve('contact-live-audit.json'),
  `${JSON.stringify(results, null, 2)}\n`,
  'utf8',
);

console.log(JSON.stringify(results.map(result => ({
  width: result.width,
  clientWidth: result.viewport.clientWidth,
  scrollWidth: result.viewport.scrollWidth,
  formWidth: result.form.rect.width,
  fieldWidths: result.form.fields.map(field => field.rect.width),
  smallTargetCount: result.smallTargets.length,
  offenderCount: result.horizontalOffenders.length,
})), null, 2));
