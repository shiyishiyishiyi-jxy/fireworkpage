// 获取 canvas 元素和绘图上下文
const canvas = document.getElementById('fireworks');
const ctx = canvas.getContext('2d');

// 设置 canvas 大小为窗口大小
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// 烟花粒子类
class Particle {
    constructor(x, y, color, angle, speed) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.size = Math.random() * 2 + 1;
        this.angle = angle;
        this.speed = speed;
        this.alpha = 1;
        this.gravity = 0.05;
    }

    update() {
        // 根据角度和速度更新粒子位置
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed;
        this.speed -= this.gravity;
        this.alpha -= 0.02;
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
        this.color = this.getRandomColor();
        this.exploded = false;
        this.particles = [];
    }

    // 获取随机颜色，增加颜色的多样性
    getRandomColor() {
        const colors = [
            `hsl(${Math.random() * 360}, 100%, 50%)`,
            `hsl(${Math.random() * 360}, 100%, 60%)`,
            `hsl(${Math.random() * 360}, 100%, 70%)`,
            `hsl(${Math.random() * 360}, 100%, 80%)`
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    update() {
        if (!this.exploded) {
            this.y -= this.speedY;
            if (this.y <= this.targetY) {
                this.exploded = true;
                const numParticles = Math.floor(Math.random() * 80) + 60; // 粒子数量随机化
                for (let i = 0; i < numParticles; i++) {
                    const angle = Math.random() * Math.PI * 2;
                    const speed = Math.random() * 3 + 1;
                    this.particles.push(new Particle(this.x, this.y, this.color, angle, speed));
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
    if (Math.random() < 0.03) {
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
