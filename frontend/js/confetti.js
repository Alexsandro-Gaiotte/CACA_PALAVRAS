/**
 * Confetti Cannon - Efeito de confetes festivos para a vitória
 */
class ConfettiCannon {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
    this.particles = [];
    this.animationId = null;
    this.colors = ['#ff3b30', '#ffcc00', '#34c759', '#007aff', '#af52de', '#ff9500'];

    if (this.canvas) {
      this.resize();
      window.addEventListener('resize', () => this.resize());
    }
  }

  resize() {
    if (!this.canvas) return;
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  fire(durationMs = 3500) {
    if (!this.canvas || !this.ctx) return;
    this.resize();
    this.particles = [];

    const count = 140;
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: this.canvas.width / 2 + (Math.random() - 0.5) * 200,
        y: this.canvas.height / 2 + 100,
        vx: (Math.random() - 0.5) * 14,
        vy: -Math.random() * 16 - 6,
        size: Math.random() * 8 + 6,
        color: this.colors[Math.floor(Math.random() * this.colors.length)],
        rotation: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 10,
        opacity: 1
      });
    }

    const startTime = performance.now();
    cancelAnimationFrame(this.animationId);

    const update = (time) => {
      const elapsed = time - startTime;
      if (elapsed > durationMs && this.particles.length === 0) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        return;
      }

      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      for (let i = this.particles.length - 1; i >= 0; i--) {
        const p = this.particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.35; // Gravidade
        p.rotation += p.rotSpeed;

        if (elapsed > durationMs - 1000) {
          p.opacity = Math.max(0, (durationMs - elapsed) / 1000);
        }

        this.ctx.save();
        this.ctx.translate(p.x, p.y);
        this.ctx.rotate((p.rotation * Math.PI) / 180);
        this.ctx.fillStyle = p.color;
        this.ctx.globalAlpha = p.opacity;
        this.ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 1.4);
        this.ctx.restore();

        if (p.y > this.canvas.height + 50 || p.opacity <= 0) {
          this.particles.splice(i, 1);
        }
      }

      this.animationId = requestAnimationFrame(update);
    };

    this.animationId = requestAnimationFrame(update);
  }

  stop() {
    cancelAnimationFrame(this.animationId);
    if (this.ctx && this.canvas) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
    this.particles = [];
  }
}

window.confettiCannon = new ConfettiCannon('confetti-canvas');
