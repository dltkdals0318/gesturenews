/**
 * 통합 파티클 시스템
 * Tea와 Bomb 파티클을 관리
 */

class TeaParticle {
  constructor(x, y, angle, newsData, settings) {
    this.newsData = newsData;

    // 뉴스 제목에서 단어 추출
    if (newsData && newsData.title) {
      let words = newsData.title.split(" ")
        .filter((w) => w.length > settings.particle.minWordLength);

      if (words.length > 0) {
        this.text = words[Math.floor(Math.random() * words.length)];
      } else {
        this.text = "tea";
      }

      // 너무 긴 단어는 자르기
      if (this.text.length > settings.particle.maxWordLength) {
        this.text = this.text.substring(0, settings.particle.maxWordLength);
      }
    } else {
      this.text = "tea";
    }

    this.size = settings.particle.textSize;
    this.alpha = 255;

    // 텍스트 크기에 맞는 반지름 계산
    this.radius = this.text.length * this.size * settings.particle.physics.radius;

    // Matter.js body 생성
    this.body = Bodies.circle(x, y, this.radius, {
      restitution: settings.particle.physics.restitution,
      friction: settings.particle.physics.friction,
      density: settings.particle.physics.density,
      label: "teaParticle",
    });

    // 초기 속도 설정
    const vel = settings.particle.velocity;
    let speed = random(vel.speedMin, vel.speedMax);
    let vx = cos(angle + random(vel.angleMin, vel.angleMax)) * speed;
    let vy = sin(angle + random(vel.angleMin, vel.angleMax)) * speed +
             random(vel.verticalMin, vel.verticalMax);

    Body.setVelocity(this.body, { x: vx, y: vy });
    Composite.add(engine.world, this.body);

    this.done = false;
    this.isHovered = false;
    this.settings = settings;
  }

  update() {
    return true;
  }

  checkHover(mx, my) {
    let pos = this.body.position;
    let d = dist(mx, my, pos.x, pos.y);
    this.isHovered = d < this.radius;
  }

  display() {
    if (this.done) return;

    let pos = this.body.position;
    let angle = this.body.angle;

    push();
    translate(pos.x, pos.y);
    rotate(angle);

    textAlign(CENTER, CENTER);
    textStyle(BOLD);
    textFont(this.settings.particle.font); // 모드별 폰트 적용

    let currentSize = this.size;
    const colors = this.settings.particle;

    if (this.isHovered) {
      fill(colors.hoverColor.r, colors.hoverColor.g, colors.hoverColor.b, this.alpha);
      currentSize = this.size * this.settings.particle.hover.sizeMultiplier;
      cursor(HAND);
    } else {
      fill(colors.defaultColor.r, colors.defaultColor.g, colors.defaultColor.b, this.alpha);
    }

    textSize(currentSize);
    noStroke();
    text(this.text, 0, 0);

    pop();
  }

  isClicked(mx, my) {
    if (this.done) return false;
    let pos = this.body.position;
    let d = dist(mx, my, pos.x, pos.y);
    return d < this.radius;
  }

  openNews() {
    if (this.newsData && this.newsData.url) {
      window.open(this.newsData.url, "_blank");
      console.log("Opening news:", this.newsData.title);
    }
  }

  remove() {
    Composite.remove(engine.world, this.body);
  }

  applyUpwardForce() {
    Body.applyForce(this.body, this.body.position, { x: 0, y: -0.008 });
  }
}

/**
 * Bomb 파티클 생성 함수
 */
function createBomb(x, y, newsData) {
  let textChunks = [];
  if (newsData && newsData.title) {
    // 제목을 3-5개 단어 단위로 묶어서 분리
    let words = newsData.title.split(/\s+/).filter((w) => w.length > 0);
    let chunkSize = Math.ceil(words.length / random(3, 5)); // 3-5개 덩어리로

    for (let i = 0; i < words.length; i += chunkSize) {
      let chunk = words.slice(i, i + chunkSize).join(" ");
      textChunks.push(chunk);
    }
  }

  if (textChunks.length === 0) {
    textChunks = ["긴급 속보", "시사 뉴스", "정치 사건"];
  }

  return {
    newsData: newsData,
    x: x,
    y: y,
    size: VisualSettings.bombshell.bomb.sizeDefault,
    velocityY: 0,
    gravity: VisualSettings.bombshell.bomb.gravity,
    exploded: false,
    explosionParticles: [],
    done: false,
    words: textChunks
  };
}

function updateBomb(bomb) {
  if (!bomb.exploded) {
    bomb.velocityY += bomb.gravity;
    bomb.y += bomb.velocityY;

    if (bomb.y + bomb.size / 2 >= height - 10) {
      explodeBomb(bomb);
    }
  }
}

function explodeBomb(bomb) {
  bomb.exploded = true;
  const settings = VisualSettings.bombshell.explosion;

  for (let word of bomb.words) {
    let angle = random(TWO_PI);
    let speed = random(settings.velocity.speedMin, settings.velocity.speedMax);
    let vx = cos(angle) * speed;
    let vy = sin(angle) * speed - random(settings.velocity.upwardMin, settings.velocity.upwardMax);

    let textSize = settings.textSize;
    let radius = word.length * textSize * settings.physics.radius;

    let body = Bodies.circle(bomb.x, bomb.y, radius, {
      restitution: settings.physics.restitution,
      friction: settings.physics.friction,
      density: settings.physics.density,
      label: "explosionParticle",
    });

    Body.setVelocity(body, { x: vx, y: vy });
    Composite.add(engine.world, body);

    bomb.explosionParticles.push({
      text: word,
      body: body,
      alpha: 255,
      size: textSize,
      newsUrl: bomb.newsData.url,
      radius: radius
    });
  }
}

function displayBomb(bomb) {
  if (!bomb.exploded) {
    push();
    translate(bomb.x, bomb.y);
    rotate(bomb.velocityY * 0.05);

    if (bombImage && bombImage.width > 0) {
      imageMode(CENTER);
      image(bombImage, 0, 0, bomb.size, bomb.size);
    } else {
      fill(50, 50, 50);
      stroke(0);
      strokeWeight(2);
      ellipse(0, 0, bomb.size * 0.8, bomb.size * 0.8);

      stroke(139, 69, 19);
      strokeWeight(3);
      line(0, -bomb.size * 0.4, 0, -bomb.size * 0.6);

      fill(255, 100, 0);
      noStroke();
      ellipse(0, -bomb.size * 0.6, 10, 15);
    }

    pop();
  } else {
    const colors = VisualSettings.bombshell.explosion;

    for (let p of bomb.explosionParticles) {
      let pos = p.body.position;
      let angle = p.body.angle;

      push();
      translate(pos.x, pos.y);
      rotate(angle);

      textAlign(CENTER, CENTER);
      textStyle(BOLD);
      textFont(VisualSettings.bombshell.explosion.font); // Bombshell 모드 폰트 적용

      fill(colors.color.r, colors.color.g, colors.color.b, 255);
      noStroke();
      textSize(p.size);
      text(p.text, 0, 0);
      pop();
    }
  }
}

function checkBombHover(bomb, mx, my) {
  if (!bomb.exploded) return false;

  for (let p of bomb.explosionParticles) {
    let pos = p.body.position;
    let d = dist(mx, my, pos.x, pos.y);
    if (d < p.radius) {
      cursor(HAND);
      return true;
    }
  }
  return false;
}

function isBombClicked(bomb, mx, my) {
  if (!bomb.exploded) return false;

  for (let p of bomb.explosionParticles) {
    let pos = p.body.position;
    let d = dist(mx, my, pos.x, pos.y);
    if (d < p.radius) {
      return true;
    }
  }
  return false;
}

function openBombNews(bomb) {
  if (bomb.newsData && bomb.newsData.url) {
    window.open(bomb.newsData.url, "_blank");
    console.log("Opening news:", bomb.newsData.title);
  }
}

/**
 * Warm Up 파티클 클래스
 * 캠프파이어에서 위로 솟아오르는 재 파티클
 */
class WarmUpParticle {
  constructor(x, y, newsData, settings) {
    this.newsData = newsData;

    // 뉴스 제목에서 단어 추출
    if (newsData && newsData.title) {
      let words = newsData.title.split(" ")
        .filter((w) => w.length > settings.particle.minWordLength);

      if (words.length > 0) {
        this.text = words[Math.floor(Math.random() * words.length)];
      } else {
        this.text = "ash";
      }

      // 너무 긴 단어는 자르기
      if (this.text.length > settings.particle.maxWordLength) {
        this.text = this.text.substring(0, settings.particle.maxWordLength);
      }
    } else {
      this.text = "ash";
    }

    this.size = settings.particle.textSize;
    this.alpha = 255;

    // 랜덤 재 색상 선택
    const colorOptions = settings.particle.colors;
    this.color = colorOptions[Math.floor(Math.random() * colorOptions.length)];

    // 텍스트 크기에 맞는 반지름 계산
    this.radius = this.text.length * this.size * settings.particle.physics.radius;

    // Matter.js body 생성
    this.body = Bodies.circle(x, y, this.radius, {
      restitution: settings.particle.physics.restitution,
      friction: settings.particle.physics.friction,
      density: settings.particle.physics.density,
      label: "warmupParticle",
    });

    // 초기 속도 설정 (위로 솟아오름) - 더 다양한 방향
    const vel = settings.particle.velocity;
    let speed = random(vel.speedMin, vel.speedMax);
    let angle = -PI / 2 + random(-vel.angleSpread * 3, vel.angleSpread * 3); // 각도 범위 3배 증가
    let vx = cos(angle) * speed * random(0.5, 1.5); // 좌우 속도 랜덤 증가
    let vy = random(vel.upwardMin, vel.upwardMax); // 음수: 위로

    Body.setVelocity(this.body, { x: vx, y: vy });
    Composite.add(engine.world, this.body);

    this.done = false;
    this.isHovered = false;
    this.settings = settings;
  }

  update() {
    // 중력이 반대로 설정되어 있으므로 추가 힘 적용 불필요
    // Tea 모드처럼 안정적으로 올라가기
    return true;
  }

  checkHover(mx, my) {
    let pos = this.body.position;
    let d = dist(mx, my, pos.x, pos.y);
    this.isHovered = d < this.radius;
  }

  display() {
    if (this.done) return;

    let pos = this.body.position;
    let angle = this.body.angle;

    push();
    translate(pos.x, pos.y);
    rotate(angle);

    textAlign(CENTER, CENTER);
    textStyle(BOLD);
    textFont(this.settings.particle.font); // Warm Up 모드 폰트 적용

    let currentSize = this.size;
    const hoverColor = this.settings.particle.hoverColor;

    if (this.isHovered) {
      fill(hoverColor.r, hoverColor.g, hoverColor.b, this.alpha);
      currentSize = this.size * this.settings.particle.hover.sizeMultiplier;
      cursor(HAND);
    } else {
      fill(this.color.r, this.color.g, this.color.b, this.alpha);
    }

    textSize(currentSize);
    noStroke();
    text(this.text, 0, 0);

    pop();
  }

  isClicked(mx, my) {
    if (this.done) return false;
    let pos = this.body.position;
    let d = dist(mx, my, pos.x, pos.y);
    return d < this.radius;
  }

  openNews() {
    if (this.newsData && this.newsData.url) {
      window.open(this.newsData.url, "_blank");
      console.log("Opening news:", this.newsData.title);
    }
  }

  remove() {
    Composite.remove(engine.world, this.body);
  }

  applyUpwardForce() {
    Body.applyForce(this.body, this.body.position, { x: 0, y: -0.008 });
  }
}
