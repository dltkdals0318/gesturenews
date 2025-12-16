// Matter.js 모듈
const Engine = Matter.Engine;
const Bodies = Matter.Bodies;
const Composite = Matter.Composite;
const Body = Matter.Body;

// Matter.js 엔진
let engine;

// MediaPipe Hands
let video;
let hands;
let camera;
let isModelLoaded = false;

// Assets
let cupImage;
let bombImage;
let campfireImage;

// News Data
let newsArticles = [];
let teaNewsArticles = [];
let bombshellNewsArticles = [];
let warmupNewsArticles = [];
let isNewsLoaded = false;

// Particles
let teaParticles = [];
let bombParticles = [];
let warmupParticles = [];

// Bomb State
let handBomb = null;
let bombCooldown = 0;

// Hand Tracking
let handResults = [];
let handedness = [];

// Mode
let currentMode = "tea";

// UI Buttons
let resetButton;
let teaModeButton;
let bombModeButton;
let warmupModeButton;

// Preload Assets
function preload() {
  cupImage = loadImage(
    VisualSettings.tea.cup.imageFile,
    () => console.log("Cup image loaded"),
    () => console.log("Cup image failed to load")
  );

  bombImage = loadImage(
    VisualSettings.bombshell.bomb.imageFile,
    () => console.log("Bomb image loaded"),
    () => console.log("Bomb image failed to load")
  );

  campfireImage = loadImage(
    VisualSettings.warmup.campfire.imageFile,
    () => console.log("Campfire image loaded"),
    () => console.log("Campfire image failed to load")
  );

  loadNewsData();
}

// Load News Data
async function loadNewsData() {
  // 먼저 폴백 데이터로 초기화하여 즉시 사용 가능하도록 함
  teaNewsArticles = NewsService.getFallbackArticles("tea");
  bombshellNewsArticles = NewsService.getFallbackArticles("bombshell");
  warmupNewsArticles = NewsService.getFallbackArticles("warmup");
  isNewsLoaded = true;
  newsArticles = teaNewsArticles;
  console.log("Fallback articles loaded, fetching real articles...");

  // 실제 뉴스 데이터를 비동기로 로드
  try {
    const teaQueries = NewsFilters.getRandomQueries("tea", 3);
    const teaConfig = NewsFilters.tea;
    const teaResults = await NewsService.loadNewsForMode(
      "tea",
      teaQueries,
      teaConfig
    );
    if (teaResults.length > 0) {
      teaNewsArticles = teaResults;
      if (currentMode === "tea") newsArticles = teaNewsArticles;
      console.log(`Tea articles loaded: ${teaResults.length}`);
    }

    const bombQueries = NewsFilters.getRandomQueries("bombshell", 3);
    const bombConfig = NewsFilters.bombshell;
    const bombResults = await NewsService.loadNewsForMode(
      "bombshell",
      bombQueries,
      bombConfig
    );
    if (bombResults.length > 0) {
      bombshellNewsArticles = bombResults;
      if (currentMode === "bombshell") newsArticles = bombshellNewsArticles;
      console.log(`Bombshell articles loaded: ${bombResults.length}`);
    }

    const warmupQueries = NewsFilters.getRandomQueries("warmup", 3);
    const warmupConfig = NewsFilters.warmup;
    const warmupResults = await NewsService.loadNewsForMode(
      "warmup",
      warmupQueries,
      warmupConfig
    );
    if (warmupResults.length > 0) {
      warmupNewsArticles = warmupResults;
      if (currentMode === "warmup") newsArticles = warmupNewsArticles;
      console.log(`Warmup articles loaded: ${warmupResults.length}`);
    }

    console.log("All real articles loaded successfully!");
  } catch (error) {
    console.error("Error loading news articles:", error);
    // 폴백 데이터가 이미 설정되어 있으므로 계속 진행
  }
}

// Setup
function setup() {
  createCanvas(VisualSettings.canvas.width, VisualSettings.canvas.height);
  // 각 모드별로 다른 폰트를 사용하므로 기본 폰트 설정 제거

  engine = Engine.create();
  engine.gravity.x = VisualSettings.physics.gravity.x;
  engine.gravity.y = VisualSettings.physics.gravity.y;

  const wallThickness = VisualSettings.physics.walls.thickness;
  const offset = wallThickness / 2 + VisualSettings.physics.walls.offset;

  Composite.add(engine.world, [
    Bodies.rectangle(-offset, height / 2, wallThickness, height * 2, {
      isStatic: true,
      label: "wall",
    }),
    Bodies.rectangle(width + offset, height / 2, wallThickness, height * 2, {
      isStatic: true,
      label: "wall",
    }),
    Bodies.rectangle(width / 2, -offset, width * 2, wallThickness, {
      isStatic: true,
      label: "wall",
    }),
    Bodies.rectangle(width / 2, height + offset, width * 2, wallThickness, {
      isStatic: true,
      label: "wall",
    }),
  ]);

  const videoSize = VisualSettings.handTracking.videoSize;
  video = createCapture(VIDEO);
  video.size(videoSize.width, videoSize.height);
  video.hide();

  hands = new Hands({
    locateFile: (file) =>
      `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
  });

  const handConfig = VisualSettings.handTracking;
  hands.setOptions({
    maxNumHands: handConfig.maxNumHands,
    modelComplexity: handConfig.modelComplexity,
    minDetectionConfidence: handConfig.minDetectionConfidence,
    minTrackingConfidence: handConfig.minTrackingConfidence,
  });

  hands.onResults(onHandResults);

  camera = new Camera(video.elt, {
    onFrame: async () => {
      await hands.send({ image: video.elt });
    },
    width: videoSize.width,
    height: videoSize.height,
  });

  camera.start();
  setTimeout(() => {
    isModelLoaded = true;
  }, 2000);

  UIHandlers.createModeButtons();
  UIHandlers.createResetButton();
}

// Draw Loop
function draw() {
  Engine.update(engine);

  push();
  translate(width, 0);
  scale(-1, 1);
  push();
  image(video, 0, 0);
  filter(GRAY);
  pop();
  pop();

  let anyHovered = false;
  for (let i = teaParticles.length - 1; i >= 0; i--) {
    let particle = teaParticles[i];
    particle.checkHover(mouseX, mouseY);
    if (particle.isHovered) anyHovered = true;
    particle.update();
    particle.display();
  }

  for (let i = bombParticles.length - 1; i >= 0; i--) {
    let bomb = bombParticles[i];
    updateBomb(bomb);
    displayBomb(bomb);
    if (checkBombHover(bomb, mouseX, mouseY)) anyHovered = true;
  }

  for (let i = warmupParticles.length - 1; i >= 0; i--) {
    let particle = warmupParticles[i];
    particle.checkHover(mouseX, mouseY);
    if (particle.isHovered) anyHovered = true;
    particle.update();
    particle.display();
  }

  if (!anyHovered) {
    cursor(ARROW);
  }

  if (currentMode === "warmup") {
    drawCampfire();
  }

  push();
  translate(width, 0);
  scale(-1, 1);
  drawHandAndCup();
  pop();
}

// Draw Hand and Cup/Bomb
function drawHandAndCup() {
  if (handResults && handResults.length > 0) {
    const landmarks = handResults[0];
    const landmark4 = landmarks[4];
    const landmark8 = landmarks[8];

    let x4 = landmark4.x * width;
    let y4 = landmark4.y * height;
    let x8 = landmark8.x * width;
    let y8 = landmark8.y * height;

    let fingerDistance = dist(x4, y4, x8, y8);
    let midX = (x4 + x8) / 2;
    let midY = (y4 + y8) / 2;

    let angle;
    let isRightHand =
      handedness && handedness[0] && handedness[0].label === "Left";

    if (isRightHand) {
      angle = atan2(y4 - y8, x4 - x8);
    } else {
      angle = atan2(y8 - y4, x8 - x4);
    }

    const cupSettings = VisualSettings.tea.cup;
    let cupSize = map(
      fingerDistance,
      20,
      150,
      cupSettings.sizeMin,
      cupSettings.sizeMax
    );
    cupSize = constrain(cupSize, cupSettings.sizeMin, cupSettings.sizeMax);

    if (currentMode === "tea") {
      if (abs(angle) > cupSettings.tiltAngle && isNewsLoaded) {
        if (frameCount % VisualSettings.tea.generation.frameInterval === 0) {
          let randomNews =
            newsArticles[Math.floor(Math.random() * newsArticles.length)];
          let normalX = width - midX;
          teaParticles.push(
            new TeaParticle(
              normalX,
              midY,
              angle,
              randomNews,
              VisualSettings.tea
            )
          );
        }
      }
      drawCup(midX, midY, cupSize, angle);
    } else if (currentMode === "bombshell") {
      if (bombCooldown > 0) {
        bombCooldown--;
      }

      if (handBomb === null && bombCooldown === 0 && isNewsLoaded) {
        let randomNews =
          newsArticles[Math.floor(Math.random() * newsArticles.length)];
        handBomb = {
          newsData: randomNews,
          createdAt: frameCount,
        };
      }

      if (handBomb !== null) {
        const dropDistance = VisualSettings.bombshell.bomb.dropDistance;
        if (fingerDistance > dropDistance) {
          let normalX = width - midX;
          bombParticles.push(createBomb(normalX, midY, handBomb.newsData));
          handBomb = null;
          bombCooldown = VisualSettings.bombshell.bomb.respawnTime;
        } else {
          drawBomb(midX, midY, cupSize);
        }
      }
    }
  }
}

// Draw Campfire
function drawCampfire() {
  const campfireSettings = VisualSettings.warmup.campfire;
  const campfireX = width / 2;
  const campfireY =
    height - campfireSettings.offsetY - campfireSettings.size / 2;

  let isHandOverCampfire = false;
  if (handResults && handResults.length >= 2) {
    let bothHandsValid = true;

    for (let i = 0; i < 2; i++) {
      const landmarks = handResults[i];
      if (!landmarks || landmarks.length === 0) {
        bothHandsValid = false;
        break;
      }

      const palmCenter = landmarks[9];
      const handX = palmCenter.x * width;
      const handY = palmCenter.y * height;

      const campfireRadius = campfireSettings.size / 2 + 100;
      const distance = dist(handX, handY, campfireX, campfireY);
      if (distance >= campfireRadius) {
        bothHandsValid = false;
        break;
      }

      const indexTip = landmarks[8];
      const middleTip = landmarks[12];
      const ringTip = landmarks[16];
      const pinkyTip = landmarks[20];

      const fingersUp =
        indexTip.y < palmCenter.y - 0.05 &&
        middleTip.y < palmCenter.y - 0.05 &&
        ringTip.y < palmCenter.y - 0.05 &&
        pinkyTip.y < palmCenter.y - 0.05;

      if (!fingersUp) {
        bothHandsValid = false;
        break;
      }
    }

    isHandOverCampfire = bothHandsValid;
  }

  if (
    isHandOverCampfire &&
    frameCount % VisualSettings.warmup.generation.frameInterval === 0 &&
    isNewsLoaded
  ) {
    let randomNews =
      newsArticles[Math.floor(Math.random() * newsArticles.length)];
    warmupParticles.push(
      new WarmUpParticle(
        campfireX,
        campfireY - campfireSettings.size / 2,
        randomNews,
        VisualSettings.warmup
      )
    );
  }

  if (campfireImage && campfireImage.width > 0) {
    push();
    imageMode(CENTER);
    image(
      campfireImage,
      campfireX,
      campfireY,
      campfireSettings.size,
      campfireSettings.size
    );
    pop();
  } else {
    push();
    translate(campfireX, campfireY);
    fill(255, 100, 0);
    noStroke();
    triangle(-30, 0, 30, 0, 0, -50);
    fill(255, 200, 0);
    triangle(-20, 0, 20, 0, 0, -40);
    fill(101, 67, 33);
    stroke(50);
    strokeWeight(2);
    rect(-40, 0, 80, 15, 5);
    rect(-30, 10, 60, 15, 5);
    pop();
  }
}

// Draw Cup
function drawCup(x, y, size, rotationAngle) {
  push();
  translate(x, y);
  rotate(rotationAngle);

  if (cupImage && cupImage.width > 0) {
    imageMode(CENTER);
    // Cup 이미지 비율: 1270 x 605 (약 2.1:1)
    const cupAspectRatio = 1270 / 605;
    const cupWidth = size * cupAspectRatio;
    const cupHeight = size;
    // 좌우 반전
    scale(-1, 1);
    image(cupImage, 0, 0, cupWidth, cupHeight);
  } else {
    let scale = size / 50;
    fill(255, 255, 255, 200);
    stroke(100);
    strokeWeight(2);
    rectMode(CENTER);
    rect(0, 0, 40 * scale, 50 * scale, 5 * scale);
    noFill();
    stroke(100);
    strokeWeight(2 * scale);
    arc(25 * scale, 0, 20 * scale, 30 * scale, -PI / 2, PI / 2);
    fill(255, 255, 255);
    stroke(100);
    strokeWeight(1 * scale);
    ellipse(0, -25 * scale, 40 * scale, 8 * scale);
    fill(139, 69, 19, 150);
    ellipse(0, -22 * scale, 35 * scale, 6 * scale);
  }

  pop();
}

// Draw Bomb
function drawBomb(x, y, size) {
  push();
  translate(x, y);

  const bombSettings = VisualSettings.bombshell.bomb;
  let bombSize = map(
    size,
    VisualSettings.tea.cup.sizeMin,
    VisualSettings.tea.cup.sizeMax,
    bombSettings.handSizeMin,
    bombSettings.handSizeMax
  );
  bombSize = constrain(
    bombSize,
    bombSettings.handSizeMin,
    bombSettings.handSizeMax
  );

  if (bombImage && bombImage.width > 0) {
    imageMode(CENTER);
    // Bomb 이미지 비율: 1258 x 1226 (약 1.03:1)
    const bombAspectRatio = 1258 / 1226;
    const bombWidth = bombSize * bombAspectRatio;
    const bombHeight = bombSize;
    // 좌우 반전하여 손에 있을 때와 떨어질 때 방향 일치
    scale(-1, 1);
    image(bombImage, 0, 0, bombWidth, bombHeight);
  } else {
    fill(50, 50, 50);
    stroke(0);
    strokeWeight(2);
    ellipse(0, 0, bombSize * 0.8, bombSize * 0.8);
    stroke(139, 69, 19);
    strokeWeight(3);
    line(0, -bombSize * 0.4, 0, -bombSize * 0.6);
    fill(255, 100, 0);
    noStroke();
    ellipse(0, -bombSize * 0.6, 10, 15);
  }

  pop();
}

// MediaPipe Hand Results Callback
function onHandResults(results) {
  handResults = results.multiHandLandmarks;
  handedness = results.multiHandedness;
}

// Mouse/Touch Event Handlers
function mousePressed() {
  UIHandlers.handleClick(mouseX, mouseY);
}

function touchStarted() {
  if (touches.length > 0) {
    UIHandlers.handleClick(touches[0].x, touches[0].y);
  }
  return false;
}
