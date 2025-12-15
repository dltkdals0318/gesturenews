/**
 * 뉴스 필터링 설정
 * 매번 다른 최신 뉴스를 가져오기 위한 정교한 필터 시스템
 */

const NewsFilters = {
  /**
   * Tea 모드: 연예계 가십 & 스캔들
   * 최신성 중심, 다양한 출처 활용
   */
  tea: {
    // 뉴스 검색 설정
    news: {
      // 다양한 키워드로 검색 범위 확대
      queries: [
        "연예인 열애",
        "연예인 스캔들",
        "연예인 논란",
        "연예인 결혼",
        "연예인 이혼",
        "아이돌 열애",
        "배우 열애",
        "디스패치",
        "연예계 불화"
      ],
      display: 30, // 각 키워드당 30개
      sort: "date", // 최신순 정렬
      // 시간 범위 필터 (선택적으로 사용)
      dateFilter: {
        enabled: false, // 네이버 API는 기본적으로 최신 뉴스만 제공
        days: 3 // 최근 3일
      }
    },

    // 블로그 검색 설정
    blog: {
      queries: [
        "연예인 가십",
        "연예인 찌라시",
        "연예인 루머",
        "아이돌 소식",
        "연예계 뒷이야기"
      ],
      display: 20, // 각 키워드당 20개
      sort: "date" // 최신순 정렬
    },

    // 중복 제거 설정
    deduplication: {
      enabled: true,
      // 제목 유사도 체크 (동일 뉴스 필터링)
      similarityThreshold: 0.7,
      // URL 호스트 기반 중복 제거
      checkHost: true
    },

    // 필터링 제외 키워드 (너무 일반적이거나 무관한 뉴스 제외)
    excludeKeywords: [
      "사망", "부고", "별세",
      "코로나", "확진",
      "주식", "부동산", "펀드",
      "공연", "콘서트", "페스티벌" // 예정된 이벤트는 제외
    ]
  },

  /**
   * Bombshell 모드: 시사 속보 & 긴급 뉴스
   * 정치, 경제, 사회 뉴스만 포함 (연예/스포츠 완전 제외)
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
        "부정부패"
      ],
      display: 50,
      sort: "date" // 최신순 우선
    },

    deduplication: {
      enabled: true,
      similarityThreshold: 0.8
    },

    // 연예/스포츠/엔터테인먼트/일상 뉴스 완전 제외
    excludeKeywords: [
      // 연예
      "연예인", "아이돌", "배우", "가수", "걸그룹", "보이그룹",
      "드라마", "영화", "예능", "방송", "tvN", "MBC", "KBS", "SBS",
      "소속사", "엔터", "컴백", "데뷔", "팬미팅", "콘서트",
      "화보", "화보 촬영", "포토", "무대", "쇼케이스",

      // 스포츠
      "스포츠", "축구", "야구", "농구", "배구", "골프",
      "선수", "감독", "경기", "리그", "올림픽", "월드컵",
      "프로야구", "프리미어", "NBA", "MLB", "KBO",

      // 일상/문화
      "공연", "전시", "페스티벌", "축제", "이벤트",
      "레시피", "맛집", "여행", "날씨", "건강팁",
      "패션", "뷰티", "메이크업", "코디",

      // 광고성
      "광고", "협찬", "홍보", "론칭", "출시"
    ],

    // 시사/정치/사회 뉴스만 포함하는 필수 키워드 (하나라도 포함되어야 함)
    requireKeywords: [
      "정치", "정부", "국회", "청와대", "대통령", "장관", "의원",
      "검찰", "경찰", "법원", "재판", "판결", "수사",
      "경제", "금융", "증시", "환율", "은행", "기업",
      "사회", "사건", "사고", "재난", "안전", "위기",
      "국제", "외교", "북한", "미국", "중국", "일본",
      "논란", "파문", "스캔들", "의혹", "비리", "부정"
    ]
  },

  /**
   * Warm Up 모드: 가벼운 토크 & 라이프스타일 뉴스
   * 친구나 지인과 가볍게 이야기 나눌 수 있는 주제들
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
        "전시회 관람"
      ],
      display: 30,
      sort: "date"
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
        "맛집 후기"
      ],
      display: 25,
      sort: "date"
    },

    deduplication: {
      enabled: true,
      similarityThreshold: 0.7
    },

    // 무겁거나 부정적인 내용 제외
    excludeKeywords: [
      "사망", "부고", "별세", "사고", "재난", "화재",
      "논란", "파문", "스캔들", "의혹", "비리", "폭로",
      "검찰", "법원", "재판", "수사", "체포", "구속",
      "위기", "충격", "긴급", "속보", "파산",
      "연예인 열애", "연예인 스캔들", "이혼", "결별",
      "정치", "국회", "정부", "대통령", "장관",
      "전쟁", "테러", "갈등", "분쟁"
    ]
  },

  /**
   * 랜덤 키워드 선택 함수
   * 매번 다른 키워드 조합을 사용하여 다양한 뉴스 제공
   */
  getRandomQueries(mode, count = 3) {
    const config = this[mode];

    // 뉴스 키워드 랜덤 선택
    const newsQueries = this._selectRandom(config.news.queries, count);

    // 블로그 키워드 랜덤 선택 (Tea 모드만)
    let blogQueries = [];
    if (config.blog) {
      blogQueries = this._selectRandom(config.blog.queries, Math.ceil(count / 2));
    }

    return {
      news: newsQueries,
      blog: blogQueries
    };
  },

  /**
   * 배열에서 랜덤하게 n개 선택
   */
  _selectRandom(array, count) {
    const shuffled = [...array].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.min(count, array.length));
  },

  /**
   * 중복 제거 함수
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
          // URL 파싱 실패 시 제목만으로 체크
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
   * 제외 키워드 필터링 + 필수 키워드 체크
   */
  filterByKeywords(articles, mode) {
    const config = this[mode];

    return articles.filter(article => {
      const text = article.title + ' ' + article.description;

      // 1. 제외 키워드 체크
      if (config.excludeKeywords && config.excludeKeywords.length > 0) {
        if (config.excludeKeywords.some(keyword => text.includes(keyword))) {
          return false; // 제외 키워드 포함 시 필터링
        }
      }

      // 2. 필수 키워드 체크 (bombshell 모드만)
      if (mode === 'bombshell' && config.requireKeywords && config.requireKeywords.length > 0) {
        // 필수 키워드 중 하나라도 포함되어야 함
        if (!config.requireKeywords.some(keyword => text.includes(keyword))) {
          return false; // 필수 키워드 없으면 필터링
        }
      }

      return true; // 통과
    });
  },

  /**
   * 최종 필터링 파이프라인
   */
  applyFilters(articles, mode) {
    let filtered = articles;

    // 1. 제외 키워드 필터링
    filtered = this.filterByKeywords(filtered, mode);

    // 2. 중복 제거
    filtered = this.removeDuplicates(filtered, mode);

    // 3. 랜덤 셔플 (매번 다른 순서)
    filtered = filtered.sort(() => Math.random() - 0.5);

    return filtered;
  }
};

// 전역으로 사용 가능하도록 설정
if (typeof window !== 'undefined') {
  window.NewsFilters = NewsFilters;
}

// Node.js 환경에서도 사용 가능
if (typeof module !== 'undefined' && module.exports) {
  module.exports = NewsFilters;
}
