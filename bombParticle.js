class BombParticle {
  constructor(x, y, newsData) {
    this.newsData = newsData;
    this.x = x;
    this.y = y;
    this.size = 60; // 폭탄 크기
    this.velocityY = 0;
    this.gravity = 0.5;
    this.exploded = false;
    this.explosionParticles = [];
    this.alpha = 255;

    // 뉴스 제목에서 단어 추출
    if (newsData && newsData.title) {
      let words = newsData.title
        .split(" ")
        .filter((w) => w.length > NewsConfig.visual.minWordLength);
      if (words.length > 0) {
        this.words = words;
      } else {
        this.words = ["BREAKING"];
      }
    } else {
      this.words = ["BREAKING"];
    }
  }

  update() {
    if (!this.exploded) {
      // 폭탄이 떨어지는 중
      this.velocityY += this.gravity;
      this.y += this.velocityY;

      // 바닥에 부딪혔는지 체크
      if (this.y + this.size / 2 >= height - 10) {
        this.explode();
      }
    } else {
      // 폭발 파티클 업데이트
      for (let i = this.explosionParticles.length - 1; i >= 0; i--) {
        let p = this.explosionParticles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.2; // 중력
        p.alpha -= 3;

        if (p.alpha <= 0) {
          this.explosionParticles.splice(i, 1);
        }
      }
    }

    // 모든 폭발 파티클이 사라지면 완료
    return this.exploded && this.explosionParticles.length === 0;
  }

  explode() {
    this.exploded = true;

    // 각 단어를 폭발 파티클로 생성
    for (let word of this.words) {
      let angle = random(TWO_PI);
      let speed = random(5, 15);
      let vx = cos(angle) * speed;
      let vy = sin(angle) * speed - random(5, 10); // 위쪽으로 더 많이

      this.explosionParticles.push({
        text: word,
        x: this.x,
        y: this.y,
        vx: vx,
        vy: vy,
        alpha: 255,
        size: random(20, 35),
        rotation: random(TWO_PI),
        rotationSpeed: random(-0.2, 0.2),
        newsUrl: this.newsData.url,
      });
    }
  }

  display() {
    if (!this.exploded) {
      // 폭탄 그리기
      imageMode(CENTER);
      push();
      translate(this.x, this.y);
      // 폭탄이 떨어지면서 살짝 회전
      rotate(this.velocityY * 0.05);
      tint(255, this.alpha);
      image(bombImage, 0, 0, this.size, this.size);
      noTint();
      pop();
    } else {
      // 폭발 파티클 그리기
      for (let p of this.explosionParticles) {
        push();
        translate(p.x, p.y);
        rotate(p.rotation);
        p.rotation += p.rotationSpeed;

        textAlign(CENTER, CENTER);
        textSize(p.size);
        textStyle(BOLD);

        // 폭발 효과 - 빨간색에서 노란색으로 그라데이션
        let colorLerp = map(p.alpha, 255, 0, 0, 1);
        let r = lerp(255, 255, colorLerp);
        let g = lerp(69, 215, colorLerp);
        let b = lerp(0, 0, colorLerp);

        // 외곽선
        stroke(255, 100, 0, p.alpha);
        strokeWeight(2);
        fill(r, g, b, p.alpha);

        text(p.text, 0, 0);
        pop();
      }
    }
  }

  // 폭발 파티클 클릭 감지
  isClicked(mx, my) {
    if (!this.exploded) return false;

    for (let p of this.explosionParticles) {
      let d = dist(mx, my, p.x, p.y);
      if (d < p.size * 2) {
        return true;
      }
    }
    return false;
  }

  // 뉴스 링크 열기
  openNews() {
    if (this.newsData && this.newsData.url) {
      window.open(this.newsData.url, "_blank");
      console.log("Opening news:", this.newsData.title);
    }
  }

  checkHover(mx, my) {
    if (!this.exploded) return false;

    for (let p of this.explosionParticles) {
      let d = dist(mx, my, p.x, p.y);
      if (d < p.size * 2) {
        this.isHovered = true;
        return true;
      }
    }
    this.isHovered = false;
    return false;
  }
}
