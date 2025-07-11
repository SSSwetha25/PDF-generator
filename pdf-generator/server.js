const express = require("express");
const puppeteer = require("puppeteer");

const app = express();
app.use(express.json({ limit: "5mb" }));

app.post("/generate", async (req, res) => {
  try {
    const { html } = req.body;

    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
    });

    await browser.close();

    // const base64PDF = pdfBuffer.toString("base64");

    // // ✅ Correctly send base64 string as JSON
    // res.setHeader("Content-Type", "application/json");
    // res.json({ data: base64PDF });
    // ✅ Convert buffer to base64
const base64PDF = pdfBuffer.toString("base64");

// ✅ Respond with proper base64 string
res.setHeader("Content-Type", "application/json");
res.json({ data: base64PDF });


  } catch (error) {
    console.error("PDF generation failed:", error);
    res.status(500).send("Failed to generate PDF");
  }
});

app.listen(4001, () => {
  console.log("📄 PDF Generator server running on http://localhost:4001");
});
