/**
 * 뉴스 API 서비스
 * 뉴스 데이터 로드 및 관리
 */

const NewsService = {
  // API Base URL
  API_BASE_URL: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:3000'
    : (window.location.hostname.includes('github.io')
        ? 'https://gesturenews.onrender.com'
        : window.location.origin),

  /**
   * 특정 모드의 뉴스 데이터 로드
   */
  async loadNewsForMode(mode, queries, config) {
    const newsPromises = queries.news.map(query =>
      this.fetchNews(query, config.news.display, config.news.sort)
    );

    const blogPromises = queries.blog
      ? queries.blog.map(query =>
          this.fetchBlog(query, config.blog.display, config.blog.sort)
        )
      : [];

    try {
      const results = await Promise.all([...newsPromises, ...blogPromises]);
      let allArticles = [];

      results.forEach((data, index) => {
        if (data.items && data.items.length > 0) {
          const source = index < queries.news.length ? "news" : "blog";
          const articles = data.items.map(item => ({
            title: Utils.decodeHTMLEntities(item.title.replace(/<[^>]*>/g, "")),
            description: Utils.decodeHTMLEntities(item.description.replace(/<[^>]*>/g, "")),
            url: item.link,
            originallink: item.originallink || item.link,
            source: source,
          }));
          allArticles = allArticles.concat(articles);
        }
      });

      return NewsFilters.applyFilters(allArticles, mode);
    } catch (error) {
      console.log(`${mode} API error:`, error);
      return this.getFallbackArticles(mode);
    }
  },

  /**
   * 뉴스 API 호출
   */
  async fetchNews(query, display, sort) {
    const url = `${this.API_BASE_URL}/api/news?query=${encodeURIComponent(query)}&display=${display}&sort=${sort}`;
    try {
      const response = await fetch(url);
      return await response.json();
    } catch (error) {
      console.error('News fetch error:', error);
      return { items: [] };
    }
  },

  /**
   * 블로그 API 호출
   */
  async fetchBlog(query, display, sort) {
    const url = `${this.API_BASE_URL}/api/blog?query=${encodeURIComponent(query)}&display=${display}&sort=${sort}`;
    try {
      const response = await fetch(url);
      return await response.json();
    } catch (error) {
      console.error('Blog fetch error:', error);
      return { items: [] };
    }
  },

  /**
   * 폴백 샘플 기사
   */
  getFallbackArticles(mode) {
    const fallbacks = {
      tea: [{
        title: "연예인 가십 샘플",
        description: "클릭하여 더 보기",
        url: "https://www.naver.com",
        source: "sample"
      }],
      bombshell: [{
        title: "긴급 속보 샘플",
        description: "클릭하여 더 보기",
        url: "https://www.naver.com",
        source: "sample"
      }],
      warmup: [{
        title: "라이프스타일 샘플",
        description: "클릭하여 더 보기",
        url: "https://www.naver.com",
        source: "sample"
      }]
    };
    return fallbacks[mode] || [];
  }
};

if (typeof window !== 'undefined') {
  window.NewsService = NewsService;
}
