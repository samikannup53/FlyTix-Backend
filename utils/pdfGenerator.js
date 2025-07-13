const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");
const QRCode = require("qrcode");

const generateTicketHTML = require("../templates/ticketTemplate");

async function generatePDF(data, outputPath) {
  try {
    const logoPath = path.join(__dirname, "../assets/images/logo.png");

    if (!fs.existsSync(logoPath)) {
      throw new Error(`Logo file not found at ${logoPath}`);
    }

    const logoBuffer = fs.readFileSync(logoPath);
    const logoBase64 = `data:image/png;base64,${logoBuffer.toString("base64")}`;
    const qrBase64 = await QRCode.toDataURL(data.pnr);

    const html = generateTicketHTML({ ...data, logoBase64, qrBase64 });

    const browser = await puppeteer.launch({
      headless: "new", // required for Puppeteer v24+
      args: ["--no-sandbox", "--disable-setuid-sandbox"], // required for most serverless platforms
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });

    await page.pdf({
      path: outputPath,
      format: "A4",
      printBackground: true,
    });

    await browser.close();
  } catch (error) {
    console.error("PDF Generation Error:", error.message);
    throw error;
  }
}

module.exports = generatePDF;
