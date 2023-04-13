// const express = require("express");
import express from "express";
import puppeteer from "puppeteer";
import pdfMake from "pdfmake";
import * as dotenv from "dotenv";
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
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", 'attachment; filename="example.pdf"');
    pdfDoc.pipe(res);
    pdfDoc.end();
    const formData = pdfDoc.read();
    const encodedBase64String = formData.toString("base64");

    axios
      .post(
        process.env.API_ENDPOINT,
        {
          data: encodedBase64String,
          senderList: ["selvaprasath.selvamani@bounteous.com"],
          fileType: "pdf",
        }
        // {
        //   headers: {
        //     "Content-Type": "application/json",
        //   },
        // }
      )
      .then((response) => {
        console.log("response", response.data);
        // res.json("Success");
      })
      .catch((error) => {
        console.log(error);
        // res.json("Something went wrong");
      });
  } catch (err) {
    console.log("err", err);
    res.json(err);
  }
});
app.post("/get", async (req, res) => {
  res.send("Hi Successfully reached get");
});
app.listen(3000, () => {
  console.log("Server listening on port 3000");
});
