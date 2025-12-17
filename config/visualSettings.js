/**
 * visualSettings
 */

const VisualSettings = {
  /**
   * canvas settings
   */
  canvas: {
    width: 585,
    height: 480,
    backgroundColor: "#e8e8e8",
  },

  /**
   * Tea Mode Settings
   */
  tea: {
    particle: {
      textSize: 19,
      font: "Ohmin",
      minWordLength: 3,
      maxWordLength: 12,

      defaultColor: {
        r: 75,
        g: 255,
        b: 0,
        alpha: 255,
      },
      hoverColor: {
        r: 206,
        g: 255,
        b: 0,
        alpha: 255,
      },

      physics: {
        restitution: 0.4,
        friction: 0.1,
        density: 0.002,
        radius: 0.25,
      },

      velocity: {
        speedMin: 2,
        speedMax: 4,
        angleMin: -0.5,
        angleMax: -0.3,
        verticalMin: 3,
        verticalMax: 5,
      },

      hover: {
        sizeMultiplier: 1.2,
        cursor: "pointer",
      },
    },

    cup: {
      imageFile: "assets/cup.png",
      sizeMin: 50,
      sizeMax: 120,
      tiltAngle: 2,
    },

    generation: {
      frameInterval: 5,
    },
  },

  /**
   * Bombshell Mode Settings
   */
  bombshell: {
    bomb: {
      imageFile: "assets/bomb.png",
      sizeDefault: 120,
      handSizeMin: 100,
      handSizeMax: 200,

      gravity: 0.5,

      dropDistance: 150,
      respawnTime: 90,
    },

    explosion: {
      textSize: 19,
      font: "Kwangin",

      defaultColor: {
        r: 255,
        g: 0,
        b: 191,
        alpha: 255,
      },
      hoverColor: {
        r: 235,
        g: 92,
        b: 255,
        alpha: 255,
      },

      physics: {
        restitution: 0.4,
        friction: 0.1,
        density: 0.002,
        radius: 0.25,
      },

      velocity: {
        speedMin: 5,
        speedMax: 15,
        upwardMin: 5,
        upwardMax: 10,
      },
    },
  },

  /**
   * Warm Up Mode Settings
   */
  warmup: {
    campfire: {
      imageFile: "assets/campfire.png",
      size: 320,
      position: {
        x: "center",
        y: "bottom",
      },
      offsetY: -40,
    },

    particle: {
      textSize: 27,
      font: "Singlife",
      minWordLength: 2,
      maxWordLength: 10,

      defaultColor: {
        r: 73,
        g: 69,
        b: 66,
        alpha: 255,
      },
      hoverColor: {
        r: 91,
        g: 89,
        b: 87,
        alpha: 255,
      },

      physics: {
        restitution: 0.3,
        friction: 0.05,
        density: 0.0005,
        radius: 0.25,
      },

      velocity: {
        speedMin: 0.0125,
        speedMax: 0.0275,
        angleSpread: 0.8,
        upwardMin: -0.075,
        upwardMax: -0.0375,
      },

      hover: {
        sizeMultiplier: 1.3,
        cursor: "pointer",
      },
    },

    // generation settings
    generation: {
      frameInterval: 16,
    },

    gravity: {
      x: 0,
      y: -0.0025,
    },
  },

  /**
   * UI Button Settings
   */
  ui: {
    teaButton: {
      text: "SPILL THE TEA",
      position: { x: -220, y: -260 },
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
      position: { x: -100, y: -220 },
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
      position: { x: -30, y: 310 },
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
   * Matter.js Engine Settings
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
   * MediaPipe Hand Tracking Settings
   */
  handTracking: {
    maxNumHands: 2,
    modelComplexity: 1,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5,
    videoSize: {
      width: 585,
      height: 480,
    },
  },
};

if (typeof window !== "undefined") {
  window.VisualSettings = VisualSettings;
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = VisualSettings;
}
