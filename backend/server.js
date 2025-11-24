// server.js
const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());

// ← REPLACE with your API key & CSE ID (you already have these in your project)
const API_KEY = "AIzaSyA-nNc7NDdypklTMhkoQ6ZxdZUcj4QMb-g";
const CSE_ID = "c079071dce0014993";

app.get("/search", async (req, res) => {
  try {
    const q = req.query.q || "";
    if (!q) return res.status(400).json({ error: "Query 'q' required" });

    // page (1-based) and num (results per page)
    let page = parseInt(req.query.page) || 1;
    let num = parseInt(req.query.num) || 10;

    // enforce Google CSE limit
    if (num < 1) num = 1;
    if (num > 10) num = 10; // CSE API max per request = 10

    // start is 1-based index of first result to return
    const start = (page - 1) * num + 1;

    const googleURL = `https://www.googleapis.com/customsearch/v1?key=${API_KEY}&cx=${CSE_ID}&q=${encodeURIComponent(q)}&num=${num}&start=${start}`;

    const response = await axios.get(googleURL);
    const items = response.data.items || [];

    const results = items.map(item => ({
      title: item.title,
      link: item.link,
      snippet: item.snippet || ""
    }));

    // try to get total results (string), convert to number if possible
    const totalResults = parseInt(response.data.searchInformation?.totalResults) || null;
    const hasMore = totalResults ? (start + num - 1) < totalResults : (items.length === num);

    res.json({
      query: q,
      page,
      num,
      totalResults,
      hasMore,
      results
    });

  } catch (error) {
    console.log("Search error:", error.response?.data || error.message);
    res.status(500).json({ error: "Search failed", details: error.response?.data || error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend running at http://localhost:${PORT}`));
