/**
 * UI 버튼 및 이벤트 핸들러
 */

const UIHandlers = {
  /**
   * 모드 버튼들 생성
   */
  createModeButtons() {
    // Tea 버튼
    teaModeButton = createButton('SPILL THE TEA');
    teaModeButton.parent('modeButtons');
    teaModeButton.class('mode-button tea-button active');
    teaModeButton.mousePressed(() => this.switchMode("tea"));

    // Bombshell 버튼
    bombModeButton = createButton('DROP A BOMBSHELL');
    bombModeButton.parent('modeButtons');
    bombModeButton.class('mode-button bomb-button');
    bombModeButton.mousePressed(() => this.switchMode("bombshell"));

    // Warm Up 버튼
    warmupModeButton = createButton('WARM UP');
    warmupModeButton.parent('modeButtons');
    warmupModeButton.class('mode-button warmup-button');
    warmupModeButton.mousePressed(() => this.switchMode("warmup"));
  },

  /**
   * 리셋 버튼 생성
   */
  createResetButton() {
    resetButton = createButton('RESET');
    resetButton.position(
      windowWidth / 2 - 30,
      windowHeight / 2 + 310
    );
    resetButton.class('reset-button');
    resetButton.mousePressed(GameState.resetAll);
  },

  /**
   * 모드 전환
   */
  switchMode(mode) {
    currentMode = mode;

    // 모든 버튼에서 active 클래스 제거
    teaModeButton.removeClass('active');
    bombModeButton.removeClass('active');
    warmupModeButton.removeClass('active');

    if (mode === "tea") {
      teaModeButton.addClass('active');
      newsArticles = teaNewsArticles;
      engine.gravity.x = VisualSettings.physics.gravity.x;
      engine.gravity.y = VisualSettings.physics.gravity.y;

      console.log(`Switched to Tea mode: ${newsArticles.length} celebrity articles`);
    } else if (mode === "bombshell") {
      bombModeButton.addClass('active');
      newsArticles = bombshellNewsArticles;
      engine.gravity.x = VisualSettings.physics.gravity.x;
      engine.gravity.y = VisualSettings.physics.gravity.y;

      console.log(`Switched to Bombshell mode: ${newsArticles.length} breaking news articles`);
    } else if (mode === "warmup") {
      warmupModeButton.addClass('active');
      newsArticles = warmupNewsArticles;
      engine.gravity.x = 0;
      engine.gravity.y = -0.8;

      console.log(`Switched to Warm Up mode: ${newsArticles.length} lifestyle articles`);
    }

    GameState.resetAll();
  },

  /**
   * 클릭/터치 핸들러
   */
  handleClick(x, y) {
    let clickedParticle = false;

    for (let bomb of bombParticles) {
      if (isBombClicked(bomb, x, y)) {
        openBombNews(bomb);
        clickedParticle = true;
        break;
      }
    }

    if (!clickedParticle) {
      for (let particle of teaParticles) {
        if (particle.isClicked(x, y)) {
          particle.openNews();
          clickedParticle = true;
          break;
        }
      }
    }

    if (!clickedParticle) {
      for (let particle of warmupParticles) {
        if (particle.isClicked(x, y)) {
          particle.openNews();
          clickedParticle = true;
          break;
        }
      }
    }

    if (!clickedParticle) {
      if (currentMode === "tea") {
        for (let particle of teaParticles) {
          particle.applyUpwardForce();
        }
      } else if (currentMode === "warmup") {
        for (let particle of warmupParticles) {
          particle.applyUpwardForce();
        }
      }
    }
  }
};

if (typeof window !== 'undefined') {
  window.UIHandlers = UIHandlers;
}
