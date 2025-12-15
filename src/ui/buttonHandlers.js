/**
 * UI 버튼 및 이벤트 핸들러
 */

const UIHandlers = {
  /**
   * 모드 버튼들 생성
   */
  createModeButtons() {
    const teaBtn = VisualSettings.ui.teaButton;
    teaModeButton = createButton(teaBtn.text);
    teaModeButton.parent('modeButtons');
    Utils.applyButtonStyle(teaModeButton, teaBtn.style);
    teaModeButton.style("background-color", teaBtn.colors.active);
    teaModeButton.style("color", teaBtn.colors.text);
    teaModeButton.style("opacity", teaBtn.colors.activeOpacity);
    teaModeButton.mousePressed(() => this.switchMode("tea"));

    const bombBtn = VisualSettings.ui.bombButton;
    bombModeButton = createButton(bombBtn.text);
    bombModeButton.parent('modeButtons');
    Utils.applyButtonStyle(bombModeButton, bombBtn.style);
    bombModeButton.style("background-color", bombBtn.colors.inactive);
    bombModeButton.style("color", bombBtn.colors.textInactive);
    bombModeButton.style("opacity", bombBtn.colors.inactiveOpacity);
    bombModeButton.mousePressed(() => this.switchMode("bombshell"));

    const warmupBtn = VisualSettings.ui.warmupButton;
    warmupModeButton = createButton(warmupBtn.text);
    warmupModeButton.parent('modeButtons');
    Utils.applyButtonStyle(warmupModeButton, warmupBtn.style);
    warmupModeButton.style("background-color", warmupBtn.colors.inactive);
    warmupModeButton.style("color", warmupBtn.colors.textInactive);
    warmupModeButton.style("opacity", warmupBtn.colors.inactiveOpacity);
    warmupModeButton.mousePressed(() => this.switchMode("warmup"));
  },

  /**
   * 리셋 버튼 생성
   */
  createResetButton() {
    const resetBtn = VisualSettings.ui.resetButton;
    resetButton = createButton(resetBtn.text);
    resetButton.position(
      windowWidth / 2 + resetBtn.position.x,
      windowHeight / 2 + resetBtn.position.y
    );
    Utils.applyButtonStyle(resetButton, resetBtn.style);
    resetButton.style("background-color", resetBtn.colors.default);
    resetButton.style("color", resetBtn.colors.text);
    resetButton.mousePressed(GameState.resetAll);

    resetButton.mouseOver(() => {
      resetButton.style("background-color", resetBtn.colors.hover);
      resetButton.style("color", resetBtn.colors.textHover);
    });
    resetButton.mouseOut(() => {
      resetButton.style("background-color", resetBtn.colors.default);
      resetButton.style("color", resetBtn.colors.text);
    });
  },

  /**
   * 모드 전환
   */
  switchMode(mode) {
    currentMode = mode;

    const teaBtn = VisualSettings.ui.teaButton;
    const bombBtn = VisualSettings.ui.bombButton;
    const warmupBtn = VisualSettings.ui.warmupButton;

    if (mode === "tea") {
      teaModeButton.style("background-color", teaBtn.colors.active);
      teaModeButton.style("color", teaBtn.colors.text);
      teaModeButton.style("opacity", teaBtn.colors.activeOpacity);
      bombModeButton.style("background-color", bombBtn.colors.inactive);
      bombModeButton.style("color", bombBtn.colors.textInactive);
      bombModeButton.style("opacity", bombBtn.colors.inactiveOpacity);
      warmupModeButton.style("background-color", warmupBtn.colors.inactive);
      warmupModeButton.style("color", warmupBtn.colors.textInactive);
      warmupModeButton.style("opacity", warmupBtn.colors.inactiveOpacity);

      newsArticles = teaNewsArticles;
      engine.gravity.x = VisualSettings.physics.gravity.x;
      engine.gravity.y = VisualSettings.physics.gravity.y;

      console.log(`Switched to Tea mode: ${newsArticles.length} celebrity articles`);
    } else if (mode === "bombshell") {
      teaModeButton.style("background-color", teaBtn.colors.inactive);
      teaModeButton.style("color", teaBtn.colors.textInactive);
      teaModeButton.style("opacity", teaBtn.colors.inactiveOpacity);
      bombModeButton.style("background-color", bombBtn.colors.active);
      bombModeButton.style("color", bombBtn.colors.text);
      bombModeButton.style("opacity", bombBtn.colors.activeOpacity);
      warmupModeButton.style("background-color", warmupBtn.colors.inactive);
      warmupModeButton.style("color", warmupBtn.colors.textInactive);
      warmupModeButton.style("opacity", warmupBtn.colors.inactiveOpacity);

      newsArticles = bombshellNewsArticles;
      engine.gravity.x = VisualSettings.physics.gravity.x;
      engine.gravity.y = VisualSettings.physics.gravity.y;

      console.log(`Switched to Bombshell mode: ${newsArticles.length} breaking news articles`);
    } else if (mode === "warmup") {
      teaModeButton.style("background-color", teaBtn.colors.inactive);
      teaModeButton.style("color", teaBtn.colors.textInactive);
      teaModeButton.style("opacity", teaBtn.colors.inactiveOpacity);
      bombModeButton.style("background-color", bombBtn.colors.inactive);
      bombModeButton.style("color", bombBtn.colors.textInactive);
      bombModeButton.style("opacity", bombBtn.colors.inactiveOpacity);
      warmupModeButton.style("background-color", warmupBtn.colors.active);
      warmupModeButton.style("color", warmupBtn.colors.text);
      warmupModeButton.style("opacity", warmupBtn.colors.activeOpacity);

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
