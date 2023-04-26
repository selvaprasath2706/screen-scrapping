import express from "express";
import fs from "fs";
import puppeteer from "puppeteer";
import pdfMake from "pdfmake";
import * as dotenv from "dotenv";
import FormData from "form-data";
dotenv.config();
import axios from "axios";
import { fonts } from "./config.js";

const app = express();
app.use(express.json({ limit: "50mb" }));
app.get("/", async (req, res) => {
  try {
    const baseURI = "https://dev.to";
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(baseURI);
    const data = await page.evaluate((baseURI) => {
      const result = [];
      const elements = document.querySelectorAll(".crayons-story__title a");
      for (const element of elements) {
        const title = element.innerText;
        const href = `${baseURI}${element?.getAttribute("href")}`;
        result.push({
          title,
          href,
        });
      }
      return result;
    }, baseURI);

    await browser.close();
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
    pdfDoc.pipe(
      fs.createWriteStream("devto.pdf").on("error", (err) => {
        console.log("err", err);
        errorCallback(err.message);
      })
    );
    pdfDoc.end();
    let reqObj = new FormData();
    reqObj.append("attachment", fs.createReadStream("./devto.pdf"));
    reqObj.append(
      "toMails",
      "selvaprasath.selvamani@bounteous.com,selva.prasath2706@gmail.com"
    );
    reqObj.append("subject", "From the latest articles of dev.to");
    reqObj.append(
      "body",
      "Hi please find the attatchment from dev.to latest articles."
    );

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: process.env.API_ENDPOINT,
      headers: {
        "Content-Type": "multipart/form-data",
      },
      data: reqObj,
    };

    axios
      .request(config)
      .then((response) => {
        res.json("Mail has been sent successfully");
      })
      .catch((error) => {
        res.json("Error in sending the mail");
      });
  } catch (err) {
    res.json(err);
  }
});
app.post("/get", async (req, res) => {
  res.send("Hi Successfully reached get");
});
app.listen(3001, () => {
  console.log("Server listening on port 3001");
});
