/**
 * 시각적 디자인 설정
 * 모든 비주얼 요소를 중앙에서 관리
 */

const VisualSettings = {
  /**
   * 캔버스 설정
   */
  canvas: {
    width: 640,
    height: 480,
    backgroundColor: "#e8e8e8", // 신문 스타일 회색 배경
  },

  /**
   * Tea 모드 설정
   */
  tea: {
    // 파티클 설정
    particle: {
      textSize: 19,
      font: "Ohmin", // Tea 모드 전용 폰트 (우아하고 클래식한 세리프 폰트)
      minWordLength: 3,
      maxWordLength: 12,

      // 색상
      defaultColor: {
        r: 34,
        g: 139,
        b: 34,
        alpha: 255,
      },
      hoverColor: {
        r: 255,
        g: 215,
        b: 0,
        alpha: 255,
      },

      // 물리 속성
      physics: {
        restitution: 0.4, // 탄성
        friction: 0.1,
        density: 0.002,
        radius: 0.25, // textSize * wordLength * radius
      },

      // 초기 속도 범위
      velocity: {
        speedMin: 2,
        speedMax: 4,
        angleMin: -0.5,
        angleMax: -0.3,
        verticalMin: 3,
        verticalMax: 5,
      },

      // 호버 효과
      hover: {
        sizeMultiplier: 1.2,
        cursor: "pointer",
      },
    },

    // 컵 설정
    cup: {
      imageFile: "assets/cup.png",
      sizeMin: 80,
      sizeMax: 200,
      tiltAngle: 2,
    },

    // 생성 빈도
    generation: {
      frameInterval: 4, // 4프레임마다 1개 생성
    },
  },

  /**
   * Bombshell 모드 설정
   */
  bombshell: {
    // 폭탄 설정
    bomb: {
      imageFile: "assets/bomb.png",
      sizeDefault: 90,
      handSizeMin: 75,
      handSizeMax: 150,

      // 물리 속성
      gravity: 0.5,

      // 드롭 조건
      dropDistance: 150, // 손가락 사이 거리
      respawnTime: 90, // 3초 (30fps 기준)
    },

    // 폭발 파티클 설정
    explosion: {
      textSize: 19,
      font: "Kwangin", // Bombshell 모드 전용 폰트 (강렬하고 굵은 폰트)

      // 색상
      color: {
        r: 255,
        g: 69,
        b: 0,
        alpha: 255,
      },
      outlineColor: {
        r: 255,
        g: 100,
        b: 0,
        alpha: 255,
      },

      // 물리 속성
      physics: {
        restitution: 0.4,
        friction: 0.1,
        density: 0.002,
        radius: 0.25, // textSize * wordLength * radius
      },

      // 초기 속도 범위
      velocity: {
        speedMin: 5,
        speedMax: 15,
        upwardMin: 5,
        upwardMax: 10,
      },
    },
  },

  /**
   * Warm Up 모드 설정
   */
  warmup: {
    // 캠프파이어 설정
    campfire: {
      imageFile: "assets/campfire.png",
      size: 320, // 480의 1/1.5 = 320
      position: {
        x: "center", // 화면 중앙
        y: "bottom", // 화면 하단
      },
      offsetY: -40, // 하단에서 40px 아래로 (60px 위로 이동)
    },

    // 재 파티클 설정
    particle: {
      textSize: 17,
      font: "Singlife", // Warm Up 모드 전용 폰트 (타자기 스타일의 모노스페이스 폰트)
      minWordLength: 2,
      maxWordLength: 10,

      // 재 색상 (검정-짙은 회색-갈색)
      colors: [
        { r: 50, g: 50, b: 50 }, // 진한 회색
        { r: 70, g: 60, b: 50 }, // 짙은 갈색
        { r: 40, g: 40, b: 40 }, // 검정에 가까운 회색
        { r: 80, g: 70, b: 60 }, // 밝은 재색
      ],
      hoverColor: {
        r: 255,
        g: 140,
        b: 0,
        alpha: 255,
      },

      // 물리 속성 (가벼운 재)
      physics: {
        restitution: 0.3,
        friction: 0.05,
        density: 0.0005, // 매우 가볍게
        radius: 0.25,
      },

      // 초기 속도 (위로 솟아오름) - 0.25배로 더 감소
      velocity: {
        speedMin: 0.0125,
        speedMax: 0.0375,
        angleSpread: 0.8, // 좌우 퍼짐 증가 (연기처럼)
        upwardMin: -0.075,
        upwardMax: -0.0375,
      },

      // 호버 효과
      hover: {
        sizeMultiplier: 1.3,
        cursor: "pointer",
      },
    },

    // 생성 빈도
    generation: {
      frameInterval: 18, // 18프레임마다 1개 생성 (매우 천천히)
    },

    // 위로 솟아오르는 중력 - 0.25배로 더 감소
    gravity: {
      x: 0,
      y: -0.0025, // 음수: 위로 올라가는 힘 (0.25배로 감소)
    },
  },

  /**
   * UI 버튼 설정
   */
  ui: {
    teaButton: {
      text: "SPILL THE TEA",
      position: { x: -220, y: -260 }, // 상대적 위치
      style: {
        padding: "12px 24px",
        fontSize: "14px",
        fontFamily: '"Times New Roman", Times, serif',
        fontWeight: "900",
        borderRadius: "0",
        border: "3px solid black",
        cursor: "pointer",
        letterSpacing: "1px",
        textTransform: "uppercase",
      },
      colors: {
        active: "black",
        inactive: "white",
        activeOpacity: "1",
        inactiveOpacity: "1",
        text: "white",
        textInactive: "black",
      },
    },

    bombButton: {
      text: "DROP A BOMBSHELL",
      position: { x: 30, y: -260 },
      style: {
        padding: "12px 24px",
        fontSize: "14px",
        fontFamily: '"Times New Roman", Times, serif',
        fontWeight: "900",
        borderRadius: "0",
        border: "3px solid black",
        cursor: "pointer",
        letterSpacing: "1px",
        textTransform: "uppercase",
      },
      colors: {
        active: "black",
        inactive: "white",
        activeOpacity: "1",
        inactiveOpacity: "1",
        text: "white",
        textInactive: "black",
      },
    },

    warmupButton: {
      text: "WARM UP",
      position: { x: -100, y: -220 }, // 가운데 위치
      style: {
        padding: "12px 24px",
        fontSize: "14px",
        fontFamily: '"Times New Roman", Times, serif',
        fontWeight: "900",
        borderRadius: "0",
        border: "3px solid black",
        cursor: "pointer",
        letterSpacing: "1px",
        textTransform: "uppercase",
      },
      colors: {
        active: "black",
        inactive: "white",
        activeOpacity: "1",
        inactiveOpacity: "1",
        text: "white",
        textInactive: "black",
      },
    },

    resetButton: {
      text: "RESET",
      position: { x: -30, y: 310 }, // 웹캠 아래로 더 내림
      style: {
        padding: "10px 20px",
        fontSize: "13px",
        fontFamily: '"Times New Roman", Times, serif',
        fontWeight: "900",
        borderRadius: "0",
        border: "2px solid black",
        cursor: "pointer",
        letterSpacing: "1px",
        textTransform: "uppercase",
        transition: "all 0.2s ease",
      },
      colors: {
        default: "white",
        hover: "black",
        text: "black",
        textHover: "white",
      },
    },
  },

  /**
   * Matter.js 물리 엔진 설정
   */
  physics: {
    gravity: {
      x: 0,
      y: 0.8,
    },
    walls: {
      thickness: 100,
      offset: 10,
    },
  },

  /**
   * MediaPipe 손 인식 설정
   */
  handTracking: {
    maxNumHands: 2, // Warm Up 모드를 위해 2개 손 인식
    modelComplexity: 1,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5,
    videoSize: {
      width: 640,
      height: 480,
    },
  },
};

// 전역으로 사용 가능하도록 설정
if (typeof window !== "undefined") {
  window.VisualSettings = VisualSettings;
}

// Node.js 환경에서도 사용 가능
if (typeof module !== "undefined" && module.exports) {
  module.exports = VisualSettings;
}
