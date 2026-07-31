import { pathToFileURL } from "node:url";
import path from "node:path";

const { chromium } = await import(pathToFileURL(process.env.PLAYWRIGHT_MODULE_PATH).href);
const widths = [320, 768, 1024, 1280, 1440, 1742, 1920];
const browser = await chromium.launch({ channel: "chrome", headless: true });
const page = await browser.newPage();
const reportUrl = pathToFileURL(path.resolve("01-HEADING-STRUCTURE.html")).href;
const results = [];

for (const width of widths) {
  await page.setViewportSize({ width, height: 900 });
  await page.goto(reportUrl);
  const result = await page.evaluate(() => {
    const forbidden = /PMingLiU|MingLiU/i;
    return {
      clientWidth: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
      h1Count: document.querySelectorAll("h1").length,
      missingDataLabels: [...document.querySelectorAll("tbody td")].filter(
        (cell) => !cell.hasAttribute("data-label"),
      ).length,
      forbiddenFonts: [...document.querySelectorAll("*")]
        .filter((element) => forbidden.test(getComputedStyle(element).fontFamily))
        .map((element) => element.tagName),
    };
  });
  if (
    result.scrollWidth > result.clientWidth ||
    result.h1Count !== 1 ||
    result.missingDataLabels ||
    result.forbiddenFonts.length
  ) {
    throw new Error(`Heading report failed at ${width}px: ${JSON.stringify(result)}`);
  }
  await page.screenshot({
    path: `heading-report-${width}.png`,
    fullPage: true,
  });
  results.push({ width, ...result });
}

await browser.close();
process.stdout.write(`${JSON.stringify(results, null, 2)}\n`);
