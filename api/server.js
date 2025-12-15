/**
 * 네이버 API 프록시 서버
 * CORS 문제를 해결하기 위한 Express 서버
 */

const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// 네이버 API 인증 정보 (환경 변수에서 로드)
const NAVER_CLIENT_ID = process.env.NAVER_CLIENT_ID;
const NAVER_CLIENT_SECRET = process.env.NAVER_CLIENT_SECRET;

// API 키 확인
if (!NAVER_CLIENT_ID || !NAVER_CLIENT_SECRET) {
  console.error('❌ Error: NAVER_CLIENT_ID and NAVER_CLIENT_SECRET must be set in environment variables');
  process.exit(1);
}

// CORS 허용
app.use(cors());

// 정적 파일 서빙 (부모 디렉토리)
app.use(express.static(path.join(__dirname, '..')));

/**
 * 네이버 뉴스 API 프록시 엔드포인트
 * @query query - 검색 키워드
 * @query display - 검색 결과 개수 (기본값: 100)
 * @query sort - 정렬 방식 (sim: 정확도순, date: 최신순)
 */
app.get('/api/news', async (req, res) => {
  const query = req.query.query;
  const display = req.query.display || 100;
  const sort = req.query.sort || 'date';

  if (!query) {
    return res.status(400).json({ error: 'Query parameter is required' });
  }

  try {
    const apiUrl = `https://openapi.naver.com/v1/search/news.json?query=${encodeURIComponent(query)}&display=${display}&sort=${sort}`;

    const response = await fetch(apiUrl, {
      headers: {
        'X-Naver-Client-Id': NAVER_CLIENT_ID,
        'X-Naver-Client-Secret': NAVER_CLIENT_SECRET,
      },
    });

    if (!response.ok) {
      throw new Error(`Naver API error: ${response.status}`);
    }

    // 응답을 텍스트로 먼저 받은 후 UTF-8로 파싱
    const text = await response.text();
    const data = JSON.parse(text);

    // UTF-8 응답 헤더 설정
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.json(data);
  } catch (error) {
    console.error('Error fetching news:', error);
    res.status(500).json({ error: 'Failed to fetch news', message: error.message });
  }
});

/**
 * 네이버 블로그 API 프록시 엔드포인트
 * @query query - 검색 키워드
 * @query display - 검색 결과 개수 (기본값: 100)
 * @query sort - 정렬 방식 (sim: 정확도순, date: 최신순)
 */
app.get('/api/blog', async (req, res) => {
  const query = req.query.query;
  const display = req.query.display || 100;
  const sort = req.query.sort || 'date';

  if (!query) {
    return res.status(400).json({ error: 'Query parameter is required' });
  }

  try {
    const apiUrl = `https://openapi.naver.com/v1/search/blog.json?query=${encodeURIComponent(query)}&display=${display}&sort=${sort}`;

    const response = await fetch(apiUrl, {
      headers: {
        'X-Naver-Client-Id': NAVER_CLIENT_ID,
        'X-Naver-Client-Secret': NAVER_CLIENT_SECRET,
      },
    });

    if (!response.ok) {
      throw new Error(`Naver API error: ${response.status}`);
    }

    // 응답을 텍스트로 먼저 받은 후 UTF-8로 파싱
    const text = await response.text();
    const data = JSON.parse(text);

    // UTF-8 응답 헤더 설정
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.json(data);
  } catch (error) {
    console.error('Error fetching blog:', error);
    res.status(500).json({ error: 'Failed to fetch blog', message: error.message });
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
