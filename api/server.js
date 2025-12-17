/**
 * Naver API Server
 */

const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");
const path = require("path");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// 네이버 API
const NAVER_CLIENT_ID = process.env.NAVER_CLIENT_ID;
const NAVER_CLIENT_SECRET = process.env.NAVER_CLIENT_SECRET;

if (!NAVER_CLIENT_ID || !NAVER_CLIENT_SECRET) {
  console.error("ID ERROR");
  process.exit(1);
}

// CORS
app.use(cors());

app.use(express.static(path.join(__dirname, "..")));

/**
 * Naver API
 * @query query - 검색 키워드
 * @query display - 검색 결과 개수
 * @query sort - 정렬 방식
 */
app.get("/api/news", async (req, res) => {
  const query = req.query.query;
  const display = req.query.display || 100;
  const sort = req.query.sort || "date";

  if (!query) {
    return res.status(400).json({ error: "Query parameter is required" });
  }

  try {
    const apiUrl = `https://openapi.naver.com/v1/search/news.json?query=${encodeURIComponent(
      query
    )}&display=${display}&sort=${sort}`;

    const response = await fetch(apiUrl, {
      headers: {
        "X-Naver-Client-Id": NAVER_CLIENT_ID,
        "X-Naver-Client-Secret": NAVER_CLIENT_SECRET,
      },
    });

    if (!response.ok) {
      throw new Error(`Naver API error: ${response.status}`);
    }

    const text = await response.text();
    const data = JSON.parse(text);

    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.json(data);
  } catch (error) {
    console.error("Error fetching news:", error);
    res
      .status(500)
      .json({ error: "Failed to fetch news", message: error.message });
  }
});

/**
 * Naver API
 * @query query - 검색 키워드
 * @query display - 검색 결과 개수
 * @query sort - 정렬 방식
 */
app.get("/api/blog", async (req, res) => {
  const query = req.query.query;
  const display = req.query.display || 100;
  const sort = req.query.sort || "date";

  if (!query) {
    return res.status(400).json({ error: "Query parameter is required" });
  }

  try {
    const apiUrl = `https://openapi.naver.com/v1/search/blog.json?query=${encodeURIComponent(
      query
    )}&display=${display}&sort=${sort}`;

    const response = await fetch(apiUrl, {
      headers: {
        "X-Naver-Client-Id": NAVER_CLIENT_ID,
        "X-Naver-Client-Secret": NAVER_CLIENT_SECRET,
      },
    });

    if (!response.ok) {
      throw new Error(`Naver API error: ${response.status}`);
    }

    const text = await response.text();
    const data = JSON.parse(text);

    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.json(data);
  } catch (error) {
    console.error("Error fetching blog:", error);
    res
      .status(500)
      .json({ error: "Failed to fetch blog", message: error.message });
  }
});

// 서버 시작
app.listen(PORT, () => {
  console.log(`✓ Server running at http://localhost:${PORT}`);
  console.log(`✓ Open http://localhost:${PORT}/index.html in your browser`);
  console.log(`✓ API endpoints:`);
  console.log(`  - /api/news?query=<keyword>&display=<num>&sort=<date|sim>`);
  console.log(`  - /api/blog?query=<keyword>&display=<num>&sort=<date|sim>`);
});
