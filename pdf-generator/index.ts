import { generatePDF } from './generate-pdf.js';
import fs from 'fs';

const html = fs.readFileSync('invoice.html', 'utf-8');
generatePDF(html, 'output.pdf');