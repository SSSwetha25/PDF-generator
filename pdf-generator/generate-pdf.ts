// generate-pdf.ts
import puppeteer from 'puppeteer';
import fs from 'fs/promises';

export async function generatePDF(html: string, outputPath: string) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.setContent(html, { waitUntil: 'networkidle0' });

  await page.pdf({
    path: outputPath,
    format: 'A4',
    printBackground: true,
  });

  await browser.close();
}
