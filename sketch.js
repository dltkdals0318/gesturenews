// ==================== Matter.js Modules ====================
const Engine = Matter.Engine;
const Bodies = Matter.Bodies;
const Composite = Matter.Composite;
const Body = Matter.Body;

// ==================== Matter.js Engine ====================
let engine;

// ==================== MediaPipe Hands ====================
let video;
let hands;
let camera;
let isModelLoaded = false;

// ==================== Assets ====================
let cupImage;
let bombImage;
let campfireImage;

// ==================== News Data ====================
let newsArticles = []; // Current mode's articles
let teaNewsArticles = []; // Tea mode articles
let bombshellNewsArticles = []; // Bombshell mode articles
let warmupNewsArticles = []; // Warm Up mode articles
let isNewsLoaded = false;

// ==================== API Configuration ====================
// 배포 환경에서는 실제 서버 URL을 사용하고, 로컬에서는 localhost 사용
const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? 'http://localhost:3000'
  : window.location.origin;

// ==================== Particles ====================
let teaParticles = [];
let bombParticles = [];
let warmupParticles = [];

// ==================== Bomb State ====================
let handBomb = null; // Bomb attached to hand
let bombCooldown = 0; // Cooldown timer in frames

// ==================== Hand Tracking ====================
let handResults = [];
let handedness = [];

// ==================== Mode ====================
let currentMode = "tea"; // "tea", "bombshell", or "warmup"

// ==================== UI Buttons ====================
let resetButton;
let teaModeButton;
let bombModeButton;
let warmupModeButton;

// ==================== Preload Assets ====================
function preload() {
  // Load cup image for Tea mode
  cupImage = loadImage(
    VisualSettings.tea.cup.imageFile,
    () => console.log("Cup image loaded"),
    () => console.log("Cup image failed to load - using default graphic")
  );

  // Load bomb image for Bombshell mode
  bombImage = loadImage(
    VisualSettings.bombshell.bomb.imageFile,
    () => console.log("Bomb image loaded"),
    () => console.log("Bomb image failed to load - using default graphic")
  );

  // Load campfire image for Warm Up mode
  campfireImage = loadImage(
    VisualSettings.warmup.campfire.imageFile,
    () => console.log("Campfire image loaded"),
    () => console.log("Campfire image failed to load - using default graphic")
  );

  // Load news data from API
  loadNewsData();
}

// ==================== Load News Data ====================
function loadNewsData() {
  // Get random queries for Tea mode using NewsFilters
  const teaQueries = NewsFilters.getRandomQueries("tea", 3);
  console.log("Tea mode queries:", teaQueries);

  const teaConfig = NewsFilters.tea;

  // Build news API promises for Tea mode
  const teaNewsPromises = teaQueries.news.map((query) => {
    const url = `${API_BASE_URL}/api/news?query=${encodeURIComponent(
      query
    )}&display=${teaConfig.news.display}&sort=${teaConfig.news.sort}`;
    return fetch(url)
      .then((res) => res.json())
      .catch(() => ({ items: [] }));
  });

  // Build blog API promises for Tea mode
  const teaBlogPromises = teaQueries.blog.map((query) => {
    const url = `${API_BASE_URL}/api/blog?query=${encodeURIComponent(
      query
    )}&display=${teaConfig.blog.display}&sort=${teaConfig.blog.sort}`;
    return fetch(url)
      .then((res) => res.json())
      .catch(() => ({ items: [] }));
  });

  // Load Tea mode news and blogs
  Promise.all([...teaNewsPromises, ...teaBlogPromises])
    .then((results) => {
      let allTeaArticles = [];

      // Process all results
      results.forEach((data, index) => {
        if (data.items && data.items.length > 0) {
          const source = index < teaQueries.news.length ? "news" : "blog";
          const articles = data.items.map((item) => ({
            title: decodeHTMLEntities(item.title.replace(/<[^>]*>/g, "")),
            description: decodeHTMLEntities(
              item.description.replace(/<[^>]*>/g, "")
            ),
            url: item.link,
            originallink: item.originallink || item.link,
            source: source,
          }));
          allTeaArticles = allTeaArticles.concat(articles);
        }
      });

      // Apply filters: remove duplicates, filter keywords, shuffle
      teaNewsArticles = NewsFilters.applyFilters(allTeaArticles, "tea");
      console.log(
        `Tea mode: ${allTeaArticles.length} raw articles -> ${teaNewsArticles.length} filtered articles`
      );

      checkNewsLoadComplete();
    })
    .catch((error) => {
      console.log("Tea API error:", error);
      teaNewsArticles = [
        {
          title: "연예인 가십 샘플",
          description: "클릭하여 더 보기",
          url: "https://www.naver.com",
          source: "sample",
        },
      ];
      checkNewsLoadComplete();
    });

  // Get random queries for Bombshell mode using NewsFilters
  const bombQueries = NewsFilters.getRandomQueries("bombshell", 3);
  console.log("Bombshell mode queries:", bombQueries);

  const bombConfig = NewsFilters.bombshell;

  // Build news API promises for Bombshell mode
  const bombNewsPromises = bombQueries.news.map((query) => {
    const url = `${API_BASE_URL}/api/news?query=${encodeURIComponent(
      query
    )}&display=${bombConfig.news.display}&sort=${bombConfig.news.sort}`;
    return fetch(url)
      .then((res) => res.json())
      .catch(() => ({ items: [] }));
  });

  // Load Bombshell mode news
  Promise.all(bombNewsPromises)
    .then((results) => {
      let allBombArticles = [];

      results.forEach((data) => {
        if (data.items && data.items.length > 0) {
          const articles = data.items.map((item) => ({
            title: decodeHTMLEntities(item.title.replace(/<[^>]*>/g, "")),
            description: decodeHTMLEntities(
              item.description.replace(/<[^>]*>/g, "")
            ),
            url: item.link,
            originallink: item.originallink || item.link,
            source: "news",
          }));
          allBombArticles = allBombArticles.concat(articles);
        }
      });

      // Apply filters: remove duplicates, filter keywords, shuffle
      bombshellNewsArticles = NewsFilters.applyFilters(
        allBombArticles,
        "bombshell"
      );
      console.log(
        `Bombshell mode: ${allBombArticles.length} raw articles -> ${bombshellNewsArticles.length} filtered articles`
      );

      checkNewsLoadComplete();
    })
    .catch((error) => {
      console.log("Bombshell API error:", error);
      bombshellNewsArticles = [
        {
          title: "긴급 속보 샘플",
          description: "클릭하여 더 보기",
          url: "https://www.naver.com",
          source: "sample",
        },
      ];
      checkNewsLoadComplete();
    });

  // Get random queries for Warm Up mode using NewsFilters
  const warmupQueries = NewsFilters.getRandomQueries("warmup", 3);
  console.log("Warm Up mode queries:", warmupQueries);

  const warmupConfig = NewsFilters.warmup;

  // Build news API promises for Warm Up mode
  const warmupNewsPromises = warmupQueries.news.map((query) => {
    const url = `${API_BASE_URL}/api/news?query=${encodeURIComponent(
      query
    )}&display=${warmupConfig.news.display}&sort=${warmupConfig.news.sort}`;
    return fetch(url)
      .then((res) => res.json())
      .catch(() => ({ items: [] }));
  });

  // Build blog API promises for Warm Up mode
  const warmupBlogPromises = warmupQueries.blog.map((query) => {
    const url = `${API_BASE_URL}/api/blog?query=${encodeURIComponent(
      query
    )}&display=${warmupConfig.blog.display}&sort=${warmupConfig.blog.sort}`;
    return fetch(url)
      .then((res) => res.json())
      .catch(() => ({ items: [] }));
  });

  // Load Warm Up mode news and blogs
  Promise.all([...warmupNewsPromises, ...warmupBlogPromises])
    .then((results) => {
      let allWarmupArticles = [];

      results.forEach((data, index) => {
        if (data.items && data.items.length > 0) {
          const source = index < warmupQueries.news.length ? "news" : "blog";
          const articles = data.items.map((item) => ({
            title: decodeHTMLEntities(item.title.replace(/<[^>]*>/g, "")),
            description: decodeHTMLEntities(
              item.description.replace(/<[^>]*>/g, "")
            ),
            url: item.link,
            originallink: item.originallink || item.link,
            source: source,
          }));
          allWarmupArticles = allWarmupArticles.concat(articles);
        }
      });

      // Apply filters
      warmupNewsArticles = NewsFilters.applyFilters(allWarmupArticles, "warmup");
      console.log(
        `Warm Up mode: ${allWarmupArticles.length} raw articles -> ${warmupNewsArticles.length} filtered articles`
      );

      checkNewsLoadComplete();
    })
    .catch((error) => {
      console.log("Warm Up API error:", error);
      warmupNewsArticles = [
        {
          title: "라이프스타일 샘플",
          description: "클릭하여 더 보기",
          url: "https://www.naver.com",
          source: "sample",
        },
      ];
      checkNewsLoadComplete();
    });
}

// ==================== Check News Load Complete ====================
function checkNewsLoadComplete() {
  if (teaNewsArticles.length > 0 && bombshellNewsArticles.length > 0 && warmupNewsArticles.length > 0) {
    isNewsLoaded = true;
    // Set default mode (Tea) articles
    newsArticles = teaNewsArticles;
    console.log("All news loaded successfully!");
  }
}

// ==================== Setup ====================
function setup() {
  // Create canvas with size from VisualSettings
  createCanvas(VisualSettings.canvas.width, VisualSettings.canvas.height);

  // Set custom font from VisualSettings
  textFont(VisualSettings.tea.particle.font);

  // Initialize Matter.js engine
  engine = Engine.create();
  // 기본 중력 설정 (아래쪽)
  engine.gravity.x = VisualSettings.physics.gravity.x;
  engine.gravity.y = VisualSettings.physics.gravity.y;

  // Create walls (boundaries) outside screen for maximum space
  const wallThickness = VisualSettings.physics.walls.thickness;
  const offset = wallThickness / 2 + VisualSettings.physics.walls.offset;

  Composite.add(engine.world, [
    // Left wall
    Bodies.rectangle(-offset, height / 2, wallThickness, height * 2, {
      isStatic: true,
      label: "wall",
    }),
    // Right wall
    Bodies.rectangle(width + offset, height / 2, wallThickness, height * 2, {
      isStatic: true,
      label: "wall",
    }),
    // Top wall
    Bodies.rectangle(width / 2, -offset, width * 2, wallThickness, {
      isStatic: true,
      label: "wall",
    }),
    // Bottom wall
    Bodies.rectangle(width / 2, height + offset, width * 2, wallThickness, {
      isStatic: true,
      label: "wall",
    }),
  ]);

  // Setup webcam
  const videoSize = VisualSettings.handTracking.videoSize;
  video = createCapture(VIDEO);
  video.size(videoSize.width, videoSize.height);
  video.hide();

  // Initialize MediaPipe Hands
  hands = new Hands({
    locateFile: (file) => {
      return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
    },
  });

  // Configure hand tracking from VisualSettings
  const handConfig = VisualSettings.handTracking;
  hands.setOptions({
    maxNumHands: handConfig.maxNumHands,
    modelComplexity: handConfig.modelComplexity,
    minDetectionConfidence: handConfig.minDetectionConfidence,
    minTrackingConfidence: handConfig.minTrackingConfidence,
  });

  hands.onResults(onHandResults);

  // Setup MediaPipe Camera
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

  // Create Tea mode button with settings from VisualSettings
  const teaBtn = VisualSettings.ui.teaButton;
  teaModeButton = createButton(teaBtn.text);
  teaModeButton.parent('modeButtons'); // 버튼을 HTML 컨테이너에 추가
  applyButtonStyle(teaModeButton, teaBtn.style);
  teaModeButton.style("background-color", teaBtn.colors.active);
  teaModeButton.style("color", teaBtn.colors.text);
  teaModeButton.style("opacity", teaBtn.colors.activeOpacity);
  teaModeButton.mousePressed(() => switchMode("tea"));

  // Create Bombshell mode button with settings from VisualSettings
  const bombBtn = VisualSettings.ui.bombButton;
  bombModeButton = createButton(bombBtn.text);
  bombModeButton.parent('modeButtons'); // 버튼을 HTML 컨테이너에 추가
  applyButtonStyle(bombModeButton, bombBtn.style);
  bombModeButton.style("background-color", bombBtn.colors.inactive);
  bombModeButton.style("color", bombBtn.colors.textInactive);
  bombModeButton.style("opacity", bombBtn.colors.inactiveOpacity);
  bombModeButton.mousePressed(() => switchMode("bombshell"));

  // Create Warm Up mode button with settings from VisualSettings
  const warmupBtn = VisualSettings.ui.warmupButton;
  warmupModeButton = createButton(warmupBtn.text);
  warmupModeButton.parent('modeButtons'); // 버튼을 HTML 컨테이너에 추가
  applyButtonStyle(warmupModeButton, warmupBtn.style);
  warmupModeButton.style("background-color", warmupBtn.colors.inactive);
  warmupModeButton.style("color", warmupBtn.colors.textInactive);
  warmupModeButton.style("opacity", warmupBtn.colors.inactiveOpacity);
  warmupModeButton.mousePressed(() => switchMode("warmup"));

  // Create Reset button with settings from VisualSettings
  const resetBtn = VisualSettings.ui.resetButton;
  resetButton = createButton(resetBtn.text);
  resetButton.position(
    windowWidth / 2 + resetBtn.position.x,
    windowHeight / 2 + resetBtn.position.y
  );
  applyButtonStyle(resetButton, resetBtn.style);
  resetButton.style("background-color", resetBtn.colors.default);
  resetButton.style("color", resetBtn.colors.text);
  resetButton.mousePressed(resetAll);

  // Hover effects for reset button
  resetButton.mouseOver(() => {
    resetButton.style("background-color", resetBtn.colors.hover);
    resetButton.style("color", resetBtn.colors.textHover);
  });
  resetButton.mouseOut(() => {
    resetButton.style("background-color", resetBtn.colors.default);
    resetButton.style("color", resetBtn.colors.text);
  });
}

// ==================== Helper: Apply Button Style ====================
function applyButtonStyle(button, styleObj) {
  Object.keys(styleObj).forEach((key) => {
    // Convert camelCase to kebab-case for CSS
    const cssKey = key.replace(/([A-Z])/g, "-$1").toLowerCase();
    button.style(cssKey, styleObj[key]);
  });
}

// ==================== Draw Loop ====================
function draw() {
  // Update Matter.js physics engine
  Engine.update(engine);

  // Mirror entire canvas for natural hand interaction
  push();
  translate(width, 0);
  scale(-1, 1);

  // Display mirrored video feed with grayscale
  push();
  image(video, 0, 0);

  // Apply grayscale filter using p5.js filter
  filter(GRAY);
  pop();

  pop(); // End mirroring

  // Draw Tea particles (in normal coordinate system) - NOW ON TOP OF VIDEO
  let anyHovered = false;
  for (let i = teaParticles.length - 1; i >= 0; i--) {
    let particle = teaParticles[i];

    // Check hover state
    particle.checkHover(mouseX, mouseY);
    if (particle.isHovered) anyHovered = true;

    particle.update();
    particle.display();
  }

  // Draw Bomb particles
  for (let i = bombParticles.length - 1; i >= 0; i--) {
    let bomb = bombParticles[i];

    updateBomb(bomb);
    displayBomb(bomb);

    // Check hover state
    if (checkBombHover(bomb, mouseX, mouseY)) anyHovered = true;
  }

  // Draw Warm Up particles
  for (let i = warmupParticles.length - 1; i >= 0; i--) {
    let particle = warmupParticles[i];

    // Check hover state
    particle.checkHover(mouseX, mouseY);
    if (particle.isHovered) anyHovered = true;

    particle.update();
    particle.display();
  }

  // Set cursor based on hover state
  if (!anyHovered) {
    cursor(ARROW);
  }

  // Draw campfire (if Warm Up mode)
  if (currentMode === "warmup") {
    drawCampfire();
  }

  // Draw hand and cup/bomb (mirrored, so drawn on top of particles)
  push();
  translate(width, 0);
  scale(-1, 1);
  drawHandAndCup();
  pop();
}

// ==================== Draw Hand and Cup/Bomb ====================
function drawHandAndCup() {
  if (handResults && handResults.length > 0) {
    const landmarks = handResults[0];

    const landmark4 = landmarks[4]; // Thumb tip
    const landmark8 = landmarks[8]; // Index finger tip

    // Scale video coordinates to canvas size
    let x4 = landmark4.x * width;
    let y4 = landmark4.y * height;
    let x8 = landmark8.x * width;
    let y8 = landmark8.y * height;

    // Calculate finger distance and midpoint
    let fingerDistance = dist(x4, y4, x8, y8);
    let midX = (x4 + x8) / 2;
    let midY = (y4 + y8) / 2;

    // Calculate rotation angle based on handedness
    let angle;
    let isRightHand =
      handedness && handedness[0] && handedness[0].label === "Left";

    if (isRightHand) {
      angle = atan2(y4 - y8, x4 - x8);
    } else {
      angle = atan2(y8 - y4, x8 - x4);
    }

    // Map finger distance to cup/bomb size
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
      // ===== Tea Mode: Spill tea when tilted =====
      if (abs(angle) > cupSettings.tiltAngle && isNewsLoaded) {
        // Generate tea particles at interval
        if (frameCount % VisualSettings.tea.generation.frameInterval === 0) {
          let randomNews =
            newsArticles[Math.floor(Math.random() * newsArticles.length)];
          // Convert mirrored coordinates to normal coordinates
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

      // Draw cup
      drawCup(midX, midY, cupSize, angle);
    } else if (currentMode === "bombshell") {
      // ===== Bombshell Mode: Drop bombs =====

      // Decrease cooldown timer
      if (bombCooldown > 0) {
        bombCooldown--;
      }

      // Create new bomb in hand if none exists and cooldown is finished
      if (handBomb === null && bombCooldown === 0 && isNewsLoaded) {
        let randomNews =
          newsArticles[Math.floor(Math.random() * newsArticles.length)];
        handBomb = {
          newsData: randomNews,
          createdAt: frameCount,
        };
        console.log("New bomb created in hand");
      }

      // If bomb exists in hand
      if (handBomb !== null) {
        // Drop bomb when fingers are far apart
        const dropDistance = VisualSettings.bombshell.bomb.dropDistance;
        if (fingerDistance > dropDistance) {
          // Convert mirrored coordinates to normal coordinates
          let normalX = width - midX;

          // Create falling bomb particle
          bombParticles.push(createBomb(normalX, midY, handBomb.newsData));

          // Remove bomb from hand and start cooldown
          handBomb = null;
          bombCooldown = VisualSettings.bombshell.bomb.respawnTime;
          console.log("Bomb dropped! Cooldown started.");
        } else {
          // Draw bomb in hand
          drawBomb(midX, midY, cupSize);
        }
      }
    } else if (currentMode === "warmup") {
      // ===== Warm Up Mode: No hand interaction =====
      // Particles auto-generate from campfire
    }
  }
}

// ==================== Draw Campfire ====================
function drawCampfire() {
  const campfireSettings = VisualSettings.warmup.campfire;
  const campfireX = width / 2;
  // 모닥불 맨 아래를 캔버스 하단에서 offsetY만큼 위로
  const campfireY = height - campfireSettings.offsetY - campfireSettings.size / 2;

  // 손이 모닥불 위에 있는지 확인
  let isHandOverCampfire = false;
  if (handResults && handResults.length > 0) {
    const landmarks = handResults[0];
    if (landmarks && landmarks.length > 0) {
      // 손바닥 중심 (landmark 9번)
      const palmCenter = landmarks[9];
      const handX = palmCenter.x * width;
      const handY = palmCenter.y * height;

      // 모닥불 영역 내에 손이 있는지 확인 (모닥불 영역을 크게)
      const campfireRadius = campfireSettings.size / 2 + 100;
      const distance = dist(handX, handY, campfireX, campfireY);
      isHandOverCampfire = distance < campfireRadius;
    }
  }

  // Generate ash particles at interval (손이 모닥불 위에 있을 때만)
  if (isHandOverCampfire && frameCount % VisualSettings.warmup.generation.frameInterval === 0 && isNewsLoaded) {
    let randomNews = newsArticles[Math.floor(Math.random() * newsArticles.length)];
    warmupParticles.push(
      new WarmUpParticle(
        campfireX,
        campfireY - campfireSettings.size / 2, // 모닥불 상단
        randomNews,
        VisualSettings.warmup
      )
    );
  }

  // Draw campfire image
  if (campfireImage && campfireImage.width > 0) {
    push();
    imageMode(CENTER);
    image(campfireImage, campfireX, campfireY, campfireSettings.size, campfireSettings.size);
    pop();
  } else {
    // Default campfire graphic
    push();
    translate(campfireX, campfireY);

    // Fire
    fill(255, 100, 0);
    noStroke();
    triangle(-30, 0, 30, 0, 0, -50);
    fill(255, 200, 0);
    triangle(-20, 0, 20, 0, 0, -40);

    // Logs
    fill(101, 67, 33);
    stroke(50);
    strokeWeight(2);
    rect(-40, 0, 80, 15, 5);
    rect(-30, 10, 60, 15, 5);

    pop();
  }
}

// ==================== Draw Cup ====================
function drawCup(x, y, size, rotationAngle) {
  push();
  translate(x, y);
  rotate(rotationAngle);

  if (cupImage && cupImage.width > 0) {
    // Draw cup image
    imageMode(CENTER);
    image(cupImage, 0, 0, size, size);
  } else {
    // Default cup graphic if image not loaded
    let scale = size / 50;

    // Cup body
    fill(255, 255, 255, 200);
    stroke(100);
    strokeWeight(2);
    rectMode(CENTER);
    rect(0, 0, 40 * scale, 50 * scale, 5 * scale);

    // Cup handle
    noFill();
    stroke(100);
    strokeWeight(2 * scale);
    arc(25 * scale, 0, 20 * scale, 30 * scale, -PI / 2, PI / 2);

    // Cup opening
    fill(255, 255, 255);
    stroke(100);
    strokeWeight(1 * scale);
    ellipse(0, -25 * scale, 40 * scale, 8 * scale);

    // Tea liquid
    fill(139, 69, 19, 150);
    ellipse(0, -22 * scale, 35 * scale, 6 * scale);
  }

  pop();
}

// ==================== Draw Bomb ====================
function drawBomb(x, y, size) {
  push();
  translate(x, y);

  // Map hand size to bomb size from VisualSettings
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
    // Draw bomb image
    imageMode(CENTER);
    image(bombImage, 0, 0, bombSize, bombSize);
  } else {
    // Default bomb graphic if image not loaded
    fill(50, 50, 50);
    stroke(0);
    strokeWeight(2);
    ellipse(0, 0, bombSize * 0.8, bombSize * 0.8);

    // Fuse
    stroke(139, 69, 19);
    strokeWeight(3);
    line(0, -bombSize * 0.4, 0, -bombSize * 0.6);

    // Flame
    fill(255, 100, 0);
    noStroke();
    ellipse(0, -bombSize * 0.6, 10, 15);
  }

  pop();
}

// ==================== MediaPipe Hand Results Callback ====================
function onHandResults(results) {
  handResults = results.multiHandLandmarks;
  handedness = results.multiHandedness;
}

// ==================== Reset All Particles ====================
function resetAll() {
  // Remove all tea particles
  for (let particle of teaParticles) {
    particle.remove();
  }
  teaParticles = [];

  // Remove all bomb particles and their Matter.js bodies
  for (let bomb of bombParticles) {
    if (bomb.exploded) {
      for (let p of bomb.explosionParticles) {
        Composite.remove(engine.world, p.body);
      }
    }
  }
  bombParticles = [];

  // Remove all warm up particles
  for (let particle of warmupParticles) {
    particle.remove();
  }
  warmupParticles = [];

  // Reset hand bomb and cooldown
  handBomb = null;
  bombCooldown = 0;

  console.log("All particles reset");
}

// ==================== Switch Mode ====================
function switchMode(mode) {
  currentMode = mode;

  const teaBtn = VisualSettings.ui.teaButton;
  const bombBtn = VisualSettings.ui.bombButton;
  const warmupBtn = VisualSettings.ui.warmupButton;

  // Update button styles based on active mode
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

    // Switch to Tea mode news
    newsArticles = teaNewsArticles;

    // 중력을 아래쪽으로 변경
    engine.gravity.x = VisualSettings.physics.gravity.x;
    engine.gravity.y = VisualSettings.physics.gravity.y;

    console.log(
      `Switched to Tea mode: ${newsArticles.length} celebrity articles`
    );
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

    // Switch to Bombshell mode news
    newsArticles = bombshellNewsArticles;

    // 중력을 아래쪽으로 변경
    engine.gravity.x = VisualSettings.physics.gravity.x;
    engine.gravity.y = VisualSettings.physics.gravity.y;

    console.log(
      `Switched to Bombshell mode: ${newsArticles.length} breaking news articles`
    );
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

    // Switch to Warm Up mode news
    newsArticles = warmupNewsArticles;

    // 중력을 위쪽으로 변경 (Warm Up만)
    engine.gravity.x = 0;
    engine.gravity.y = -0.8;

    console.log(
      `Switched to Warm Up mode: ${newsArticles.length} lifestyle articles`
    );
  }

  // Clear all particles when switching modes
  resetAll();
}

// ==================== Mouse/Touch Event Handlers ====================
function mousePressed() {
  handleClick(mouseX, mouseY);
}

function touchStarted() {
  if (touches.length > 0) {
    handleClick(touches[0].x, touches[0].y);
  }
  return false; // Prevent default behavior
}

// ==================== Handle Click/Touch ====================
function handleClick(x, y) {
  let clickedParticle = false;

  // Check if clicked on bomb particle
  for (let bomb of bombParticles) {
    if (isBombClicked(bomb, x, y)) {
      openBombNews(bomb);
      clickedParticle = true;
      break; // Only open one
    }
  }

  // Check if clicked on tea particle
  if (!clickedParticle) {
    for (let particle of teaParticles) {
      if (particle.isClicked(x, y)) {
        particle.openNews();
        clickedParticle = true;
        break; // Only open one
      }
    }
  }

  // Check if clicked on warm up particle
  if (!clickedParticle) {
    for (let particle of warmupParticles) {
      if (particle.isClicked(x, y)) {
        particle.openNews();
        clickedParticle = true;
        break; // Only open one
      }
    }
  }

  // If nothing clicked, apply upward force based on mode
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

// ==================== HTML Entity Decoder ====================
function decodeHTMLEntities(text) {
  const textarea = document.createElement("textarea");
  textarea.innerHTML = text;
  return textarea.value;
}
