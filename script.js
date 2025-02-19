// 获取 canvas 元素和绘图上下文
const canvas = document.getElementById('fireworks');
const ctx = canvas.getContext('2d');

// 设置 canvas 大小为窗口大小
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// 烟花粒子类
class Particle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.size = Math.random() * 3 + 1;
        this.speedX = (Math.random() - 0.5) * 4;
        this.speedY = Math.random() * -8 - 5;
        this.alpha = 1;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.speedY += 0.2;
        this.alpha -= 0.01;
    }

    draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.restore();
    }
}

// 烟花类
class Firework {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height;
        this.targetY = Math.random() * canvas.height * 0.3;
        this.speedY = Math.random() * 5 + 3;
        this.color = `hsl(${Math.random() * 360}, 100%, 50%)`;
        this.exploded = false;
        this.particles = [];
    }

    update() {
        if (!this.exploded) {
            this.y -= this.speedY;
            if (this.y <= this.targetY) {
                this.exploded = true;
                for (let i = 0; i < 50; i++) {
                    this.particles.push(new Particle(this.x, this.y, this.color));
                }
            }
        } else {
            for (let i = this.particles.length - 1; i >= 0; i--) {
                this.particles[i].update();
                if (this.particles[i].alpha <= 0) {
                    this.particles.splice(i, 1);
                }
            }
        }
    }

    draw() {
        if (!this.exploded) {
            ctx.beginPath();
            ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
        } else {
            for (let particle of this.particles) {
                particle.draw();
            }
        }
    }
}

// 存储烟花的数组
const fireworks = [];

// 动画循环
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 随机创建新的烟花
    if (Math.random() < 0.02) {
        fireworks.push(new Firework());
    }

    for (let i = fireworks.length - 1; i >= 0; i--) {
        fireworks[i].update();
        fireworks[i].draw();
        if (fireworks[i].exploded && fireworks[i].particles.length === 0) {
            fireworks.splice(i, 1);
        }
    }

    requestAnimationFrame(animate);
}

// 启动动画
animate();

// 窗口大小改变时更新 canvas 大小
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});
