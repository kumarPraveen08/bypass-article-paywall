const express = require("express");
const cors = require("cors");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));
const cheerio = require("cheerio");
const path = require("path");

const app = express();

// Enable CORS middleware
app.use(cors());

app.get("/", async (req, res) => {
  console.log(__dirname);
  res.sendFile(path.join(__dirname, "/index.html"));
});

// Define a route for fetching the URL
app.get("/article", async (req, res) => {
  const { site } = req.query;
  try {
    const response = await fetch(site || "https://www.ft.com/");
    let data = await response.text();
    const $ = cheerio.load(data);
    $("script").remove();
    const modifiedHtml = $.html();
    res.send(modifiedHtml);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Start the Express server
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
