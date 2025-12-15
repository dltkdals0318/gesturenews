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
    if (teaNewsArticles.length > 0 && bombshellNewsArticles.length > 0 && warmupNewsArticles.length > 0) {
      isNewsLoaded = true;
      newsArticles = teaNewsArticles;
      console.log("All news loaded successfully!");
    }
  }
};

if (typeof window !== 'undefined') {
  window.GameState = GameState;
}
