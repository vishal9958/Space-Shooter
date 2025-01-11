const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
resizeCanvas();

// Game Variables
let player, bullets, enemies, enemyBullets, healthItems, score, isGameOver, health;

// Load Images
const playerImg = new Image();
playerImg.src = 'spaceship.png';

const enemyImg = new Image();
enemyImg.src = 'enemy.png';

const bulletImg = new Image();
bulletImg.src = 'bullet.png';

const healthImg = new Image();
healthImg.src = 'health.png';

// Resize Canvas
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

// Initialize Game
function init() {
    player = {
        x: canvas.width / 2 - 25,
        y: canvas.height - 80,
        width: 50,
        height: 50,
        speed: 8
    };
    bullets = [];
    enemies = [];
    enemyBullets = [];
    healthItems = [];
    score = 0;
    health = 100;
    isGameOver = false;
    document.getElementById('score').innerText = `Score: ${score}`;
    document.getElementById('game-over').style.display = 'none';
    gameLoop();
}

// Controls
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' && player.x > 0) player.x -= player.speed;
    if (e.key === 'ArrowRight' && player.x < canvas.width - player.width) player.x += player.speed;
    if (e.key === ' ') shootBullet();
});

// Mobile Controls
document.getElementById('left-btn').addEventListener('touchstart', () => {
    if (player.x > 0) player.x -= player.speed;
});
document.getElementById('right-btn').addEventListener('touchstart', () => {
    if (player.x < canvas.width - player.width) player.x += player.speed;
});
document.getElementById('shoot-btn').addEventListener('touchstart', shootBullet);

document.getElementById('restart-btn').addEventListener('click', init);

// Shoot Bullets
function shootBullet() {
    bullets.push({ x: player.x + 20, y: player.y, width: 10, height: 20, speed: 10 });
}

// Spawn Enemies
function spawnEnemies() {
    if (Math.random() < 0.02) {
        enemies.push({
            x: Math.random() * (canvas.width - 50),
            y: 0,
            width: 50,
            height: 50,
            speed: 2 + Math.random() * 2
        });
    }
}

// Spawn Health Items
function spawnHealth() {
    if (Math.random() < 0.01) {
        healthItems.push({
            x: Math.random() * (canvas.width - 50),
            y: 0,
            width: 30,
            height: 30,
            speed: 2
        });
    }
}

// Enemy Shooting
function enemyShoot() {
    enemies.forEach(enemy => {
        if (Math.random() < 0.02) {
            enemyBullets.push({
                x: enemy.x + 20,
                y: enemy.y + 40,
                width: 10,
                height: 20,
                speed: 5
            });
        }
    });
}

// Collision Detection
function isColliding(rect1, rect2) {
    return (
        rect1.x < rect2.x + rect2.width &&
        rect1.x + rect1.width > rect2.x &&
        rect1.y < rect2.y + rect2.height &&
        rect1.y + rect1.height > rect2.y
    );
}

// Update Game State
function update() {
    bullets.forEach((bullet, index) => {
        bullet.y -= bullet.speed;
        if (bullet.y < 0) bullets.splice(index, 1);
    });

    enemies.forEach((enemy, eIndex) => {
        enemy.y += enemy.speed;

        if (isColliding(player, enemy)) gameOver();

        bullets.forEach((bullet, bIndex) => {
            if (isColliding(bullet, enemy)) {
                enemies.splice(eIndex, 1);
                bullets.splice(bIndex, 1);
                score += 10;
                document.getElementById('score').innerText = `Score: ${score}`;
            }
        });
    });

    healthItems.forEach((item, index) => {
        item.y += item.speed;
        if (isColliding(player, item)) {
            health = Math.min(health + 20, 100);
            healthItems.splice(index, 1);
        }
    });

    enemyBullets.forEach((bullet, index) => {
        bullet.y += bullet.speed;
        if (isColliding(player, bullet)) {
            health -= 10;
            enemyBullets.splice(index, 1);
            if (health <= 0) gameOver();
        }
    });
}

// Render Health Bar in Upper Right Corner
function renderHealthBar() {
    const barWidth = 200;
    const barHeight = 25;
    const x = canvas.width - barWidth - 20;
    const y = 20;

    // Background bar
    ctx.fillStyle = 'gray';
    ctx.fillRect(x, y, barWidth, barHeight);

    // Green health bar
    ctx.fillStyle = 'green';
    ctx.fillRect(x, y, (health / 100) * barWidth, barHeight);
}

// Render Game
function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(playerImg, player.x, player.y, player.width, player.height);
    bullets.forEach(bullet => ctx.drawImage(bulletImg, bullet.x, bullet.y, bullet.width, bullet.height));
    enemies.forEach(enemy => ctx.drawImage(enemyImg, enemy.x, enemy.y, enemy.width, enemy.height));
    healthItems.forEach(item => ctx.drawImage(healthImg, item.x, item.y, item.width, item.height));
    enemyBullets.forEach(bullet => ctx.drawImage(bulletImg, bullet.x, bullet.y, bullet.width, bullet.height));

    renderHealthBar(); // Render health bar
}

// Game Over
function gameOver() {
    isGameOver = true;
    document.getElementById('game-over').style.display = 'block';
}

// Game Loop
function gameLoop() {
    if (isGameOver) return;
    update();
    render();
    spawnEnemies();
    spawnHealth();
    enemyShoot();
    requestAnimationFrame(gameLoop);
}

// Start Game
window.addEventListener('resize', resizeCanvas);
init();
