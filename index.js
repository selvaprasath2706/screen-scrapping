const express = require("express");
const puppeteer = require("puppeteer");
const pdfMake = require("pdfmake");
const fonts = {
  Roboto: {
    normal: "fonts/Roboto-Regular.ttf",
    bold: "fonts/Roboto-Medium.ttf",
    italics: "fonts/Roboto-Italic.ttf",
  },
};

const app = express();

app.get("/", async (req, res) => {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto("https://dev.to");
    const data = await page.evaluate(() => {
      const result = [];
      const elements = document.querySelectorAll(".crayons-story ");
      for (let element of elements) {
        let href = "www.dev.to";
        const title = element.querySelector(
          ".crayons-story__hidden-navigation-link"
        ).innerText;
        href += element
          .querySelector(".crayons-story__hidden-navigation-link")
          .getAttribute("href");
        result.push({ title, href });
      }
      return result;
    });
    const docDefinition = {
      content: [
        { text: "The data from dev.to is", fontSize: 16 },
        data.map((indvidualData) => {
          return [
            {
              text: indvidualData.title,
              link: indvidualData.href,
              color: "blue",
            },
          ];
        }),
      ],
      fonts,
    };

    const printer = new pdfMake(fonts);
    const pdfDoc = printer.createPdfKitDocument(docDefinition);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", 'attachment; filename="example.pdf"');
    pdfDoc.pipe(res);
    pdfDoc.end();
    const formData = pdfDoc.read();
    const encodedBase64String = formData.toString("base64");
    await browser.close();
    res.json(data);
  } catch (err) {
    res.json(err);
  }
});
app.get("/get", async (req, res) => {
  res.send("Reahed get");
});
app.listen(3000, () => {
  console.log("Server listening on port 3000");
});
