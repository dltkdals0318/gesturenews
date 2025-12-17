/**
 * News Filters Configuration
 */

const NewsFilters = {
  /**
   * Tea Mode: Celebrity Gossip & Entertainment News
   */
  tea: {
    news: {
      queries: [
        "연예인 열애",
        "연예인 스캔들",
        "연예인 논란",
        "연예인 결혼",
        "연예인 이혼",
        "아이돌 열애",
        "배우 열애",
        "디스패치",
        "연예계 불화",
      ],
      display: 30,
      sort: "date",
      dateFilter: {
        enabled: false,
        days: 3,
      },
    },

    blog: {
      queries: [
        "연예인 가십",
        "연예인 찌라시",
        "연예인 루머",
        "아이돌 소식",
        "연예계 뒷이야기",
      ],
      display: 20,
      sort: "date",
    },

    // 중복 제거
    deduplication: {
      enabled: true,
      // 제목 유사도
      similarityThreshold: 0.7,
      // URL 호스트
      checkHost: true,
    },

    // Tea filter
    excludeKeywords: [
      "사망",
      "부고",
      "별세",
      "코로나",
      "확진",
      "주식",
      "부동산",
      "펀드",
      "공연",
      "콘서트",
      "페스티벌",
    ],
  },

  /**
   * Bombshell Mode: Breaking News & Emergency News
   */
  bombshell: {
    news: {
      queries: [
        "긴급 속보",
        "정치 스캔들",
        "정부 논란",
        "국회 파문",
        "검찰 수사",
        "대법원 판결",
        "경제 위기",
        "사회 충격",
        "국제 긴장",
        "외교 갈등",
        "재난 사고",
        "부정부패",
      ],
      display: 50,
      sort: "date",
    },

    deduplication: {
      enabled: true,
      similarityThreshold: 0.8,
    },

    // 제외 키워드
    excludeKeywords: [
      // 연예
      "연예인",
      "아이돌",
      "배우",
      "가수",
      "걸그룹",
      "보이그룹",
      "드라마",
      "영화",
      "예능",
      "방송",
      "tvN",
      "MBC",
      "KBS",
      "SBS",
      "소속사",
      "엔터",
      "컴백",
      "데뷔",
      "팬미팅",
      "콘서트",
      "화보",
      "화보 촬영",
      "포토",
      "무대",
      "쇼케이스",

      // 스포츠
      "스포츠",
      "축구",
      "야구",
      "농구",
      "배구",
      "골프",
      "선수",
      "감독",
      "경기",
      "리그",
      "올림픽",
      "월드컵",
      "프로야구",
      "프리미어",
      "NBA",
      "MLB",
      "KBO",

      // 일상/문화
      "공연",
      "전시",
      "페스티벌",
      "축제",
      "이벤트",
      "레시피",
      "맛집",
      "여행",
      "날씨",
      "건강팁",
      "패션",
      "뷰티",
      "메이크업",
      "코디",

      // 광고성
      "광고",
      "협찬",
      "홍보",
      "론칭",
      "출시",
    ],

    // 필수 키워드
    requireKeywords: [
      "정치",
      "정부",
      "국회",
      "청와대",
      "대통령",
      "장관",
      "의원",
      "검찰",
      "경찰",
      "법원",
      "재판",
      "판결",
      "수사",
      "경제",
      "금융",
      "증시",
      "환율",
      "은행",
      "기업",
      "사회",
      "사건",
      "사고",
      "재난",
      "안전",
      "위기",
      "국제",
      "외교",
      "북한",
      "미국",
      "중국",
      "일본",
      "논란",
      "파문",
      "의혹",
      "비리",
      "부정",
    ],
  },

  /**
   * Warm Up Mode: Lifestyle & Daily Life News
   */
  warmup: {
    news: {
      queries: [
        "맛집 추천",
        "카페 탐방",
        "여행지 추천",
        "주말 나들이",
        "반려동물 육아",
        "취미 생활",
        "운동 루틴",
        "건강 관리",
        "힐링 스팟",
        "인테리어 팁",
        "요리 레시피",
        "패션 트렌드",
        "뷰티 꿀팁",
        "책 추천",
        "영화 추천",
        "드라마 추천",
        "전시회 관람",
      ],
      display: 30,
      sort: "date",
    },

    blog: {
      queries: [
        "일상 브이로그",
        "오늘의 일기",
        "소소한 행복",
        "데일리 루틴",
        "주말 데이트",
        "친구 모임",
        "카페 후기",
        "맛집 후기",
      ],
      display: 25,
      sort: "date",
    },

    deduplication: {
      enabled: true,
      similarityThreshold: 0.7,
    },

    excludeKeywords: [
      "사망",
      "부고",
      "별세",
      "사고",
      "재난",
      "화재",
      "논란",
      "파문",
      "스캔들",
      "의혹",
      "비리",
      "폭로",
      "검찰",
      "법원",
      "재판",
      "수사",
      "체포",
      "구속",
      "위기",
      "충격",
      "긴급",
      "속보",
      "파산",
      "연예인 열애",
      "연예인 스캔들",
      "이혼",
      "결별",
      "정치",
      "국회",
      "정부",
      "대통령",
      "장관",
      "전쟁",
      "테러",
      "갈등",
      "분쟁",
    ],
  },

  /**
   * Randomly select queries for news fetching
   */
  getRandomQueries(mode, count = 3) {
    const config = this[mode];

    const newsQueries = this._selectRandom(config.news.queries, count);

    let blogQueries = [];
    if (config.blog) {
      blogQueries = this._selectRandom(
        config.blog.queries,
        Math.ceil(count / 2)
      );
    }

    return {
      news: newsQueries,
      blog: blogQueries,
    };
  },

  /**
   * 배열 선택 함수
   */
  _selectRandom(array, count) {
    const shuffled = [...array].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.min(count, array.length));
  },

  /**
   * 중복 제거
   */
  removeDuplicates(articles, mode) {
    const config = this[mode];
    if (!config.deduplication.enabled) return articles;

    const seen = new Set();
    const result = [];

    for (const article of articles) {
      // URL 호스트 기반 체크
      if (config.deduplication.checkHost) {
        try {
          const host = new URL(article.url).hostname;
          const titleKey = `${host}:${article.title.substring(0, 20)}`;

          if (seen.has(titleKey)) continue;
          seen.add(titleKey);
        } catch (e) {
          // URL 파싱 실패
          if (seen.has(article.title)) continue;
          seen.add(article.title);
        }
      } else {
        if (seen.has(article.title)) continue;
        seen.add(article.title);
      }

      result.push(article);
    }

    return result;
  },

  /**
   *  Exclude/Require Keywords Filtering
   */
  filterByKeywords(articles, mode) {
    const config = this[mode];

    return articles.filter((article) => {
      const text = article.title + " " + article.description;

      // 1. 제외 키워드
      if (config.excludeKeywords && config.excludeKeywords.length > 0) {
        if (config.excludeKeywords.some((keyword) => text.includes(keyword))) {
          return false;
        }
      }

      // 2. 필수 키워드
      if (
        mode === "bombshell" &&
        config.requireKeywords &&
        config.requireKeywords.length > 0
      ) {
        if (!config.requireKeywords.some((keyword) => text.includes(keyword))) {
          return false;
        }
      }

      return true;
    });
  },

  /**
   * Filtering Pipeline
   */
  applyFilters(articles, mode) {
    let filtered = articles;

    // 1. 제외 키워드
    filtered = this.filterByKeywords(filtered, mode);

    // 2. 중복 제거
    filtered = this.removeDuplicates(filtered, mode);

    // 3. 랜덤 셔플
    filtered = filtered.sort(() => Math.random() - 0.5);

    return filtered;
  },
};

if (typeof window !== "undefined") {
  window.NewsFilters = NewsFilters;
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = NewsFilters;
}
