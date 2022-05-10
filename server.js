const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs");
const ejsMate = require("ejs-mate");
const axios = require("axios");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const PORT = 3000;
const Info = require("./models/dbmodel");
// Laod env vars
dotenv.config({ path: "./config/config.env" });
const db = require("./config/db");
const { create } = require("./models/dbmodel");
db();

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.post("/ten", async (req, res) => {
  const response = await axios.get("https://api.wazirx.com/api/v2/tickers");
  let dataObject = Object.entries(response)[5][1];
  let dataArray = Object.values(dataObject);
  let save;

  for (let i = 0; i < 10; i++) {
    let { name, last, buy, sell, volume, base_unit } = dataArray[i];
    save = await Info.create({
      name,
      last,
      buy,
      sell,
      volume,
      base_unit,
    });
    console.log(save);
  }

  console.log(save);
  res.send("Ok");
});

app.get("/", async (req, res) => {
  const data = await Info.find();
  res.render("HodlInfo.ejs", { data });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
