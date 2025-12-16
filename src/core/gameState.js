/**
 * 게임 상태 관리
 */

const GameState = {
  /**
   * 모든 파티클 리셋
   */
  resetAll() {
    for (let particle of teaParticles) {
      particle.remove();
    }
    teaParticles = [];

    for (let bomb of bombParticles) {
      if (bomb.exploded) {
        for (let p of bomb.explosionParticles) {
          Composite.remove(engine.world, p.body);
        }
      }
    }
    bombParticles = [];

    for (let particle of warmupParticles) {
      particle.remove();
    }
    warmupParticles = [];

    handBomb = null;
    bombCooldown = 0;

    console.log("All particles reset");
  },

  /**
   * 뉴스 로드 완료 체크
   */
  checkNewsLoadComplete() {
    // 모든 배열이 정의되어 있는지 확인 (빈 배열이어도 OK)
    if (teaNewsArticles !== undefined &&
        bombshellNewsArticles !== undefined &&
        warmupNewsArticles !== undefined) {

      // 빈 배열인 경우 폴백 데이터 추가
      if (teaNewsArticles.length === 0) {
        teaNewsArticles = NewsService.getFallbackArticles('tea');
        console.log("Using fallback articles for tea mode");
      }
      if (bombshellNewsArticles.length === 0) {
        bombshellNewsArticles = NewsService.getFallbackArticles('bombshell');
        console.log("Using fallback articles for bombshell mode");
      }
      if (warmupNewsArticles.length === 0) {
        warmupNewsArticles = NewsService.getFallbackArticles('warmup');
        console.log("Using fallback articles for warmup mode");
      }

      isNewsLoaded = true;
      newsArticles = teaNewsArticles;
      console.log(`All news loaded! Tea: ${teaNewsArticles.length}, Bombshell: ${bombshellNewsArticles.length}, Warmup: ${warmupNewsArticles.length}`);
    }
  }
};

if (typeof window !== 'undefined') {
  window.GameState = GameState;
}
