class PlaneGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.gameState = 'start'; // start, playing, paused, gameover
        
        // Game objects
        this.player = {
            x: this.canvas.width / 2 - 25,
            y: this.canvas.height - 100,
            width: 50,
            height: 50,
            speed: 5,
            health: 100,
            maxHealth: 100,
            color: '#00ffff'
        };
        
        this.bullets = [];
        this.enemies = [];
        this.explosions = [];
        this.powerups = [];
        
        // Game stats
        this.score = 0;
        this.level = 1;
        this.enemiesDestroyed = 0;
        this.startTime = Date.now();
        
        // Power-ups
        this.powerupsActive = {
            rapidFire: { active: false, duration: 0, maxDuration: 10000 },
            shield: { active: false, duration: 0, maxDuration: 8000 }
        };
        
        // Game settings
        this.enemySpawnRate = 2000; // ms
        this.lastEnemySpawn = 0;
        this.bulletCooldown = 300; // ms
        this.lastBulletTime = 0;
        
        // Keys state
        this.keys = {};
        
        // Load high scores
        this.loadHighScores();
        
        // Initialize
        this.init();
    }
    
    init() {
        // Event listeners
        document.addEventListener('keydown', (e) => this.handleKeyDown(e));
        document.addEventListener('keyup', (e) => this.handleKeyUp(e));
        
        // Start game loop
        this.gameLoop();
        
        // Start enemy spawning
        this.spawnEnemies();
        
        // Update UI
        this.updateUI();
        
        // Update high scores periodically
        setInterval(() => this.loadHighScores(), 10000);
    }
    
    async loadHighScores() {
        try {
            const response = await fetch('/api/high-scores');
            const scores = await response.json();
            this.displayHighScores(scores);
        } catch (error) {
            console.error('Error loading high scores:', error);
        }
    }
    
    displayHighScores(scores) {
        const scoresList = document.getElementById('highScores');
        if (scores.length === 0) {
            scoresList.innerHTML = '<p>No scores yet!</p>';
            return;
        }
        
        scoresList.innerHTML = scores.map((score, index) => `
            <p>
                <span class="rank">${index + 1}.</span>
                <span class="name">${score.name}</span>
                <span class="score">${score.score}</span>
            </p>
        `).join('');
    }
    
    async saveHighScore() {
        const playerName = document.getElementById('playerName').value || 'Anonymous';
        
        try {
            const response = await fetch('/api/save-score', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: playerName,
                    score: this.score
                })
            });
            
            const result = await response.json();
            if (result.success) {
                alert('Score saved!');
                this.loadHighScores();
            }
        } catch (error) {
            console.error('Error saving score:', error);
        }
    }
    
    startGame() {
        this.gameState = 'playing';
        this.score = 0;
        this.level = 1;
        this.enemiesDestroyed = 0;
        this.player.health = 100;
        this.startTime = Date.now();
        
        // Clear game objects
        this.bullets = [];
        this.enemies = [];
        this.explosions = [];
        this.powerups = [];
        
        // Reset power-ups
        this.powerupsActive.rapidFire.active = false;
        this.powerupsActive.shield.active = false;
        
        // Update UI
        this.updateUI();
    }
    
    togglePause() {
        this.gameState = this.gameState === 'paused' ? 'playing' : 'paused';
    }
    
    restartGame() {
        this.startGame();
    }
    
    spawnEnemies() {
        setInterval(() => {
            if (this.gameState !== 'playing') return;
            
            const enemyTypes = [
                { type: 'basic', color: '#ff5555', width: 40, height: 40, health: 20, speed: 2, points: 10 },
                { type: 'fast', color: '#ffaa00', width: 30, height: 30, health: 10, speed: 4, points: 15 },
                { type: 'tank', color: '#5555ff', width: 60, height: 60, health: 50, speed: 1, points: 25 }
            ];
            
            const type = Math.random() > 0.7 ? (Math.random() > 0.5 ? 'fast' : 'tank') : 'basic';
            const enemy = enemyTypes.find(e => e.type === type);
            
            this.enemies.push({
                x: Math.random() * (this.canvas.width - enemy.width),
                y: -enemy.height,
                ...enemy
            });
        }, this.enemySpawnRate);
    }
    
    spawnPowerup(x, y) {
        if (Math.random() > 0.3) return; // 30% chance to spawn power-up
        
        const powerupTypes = [
            { type: 'health', color: '#ff0000', icon: '❤️', effect: 25 },
            { type: 'rapidFire', color: '#ffff00', icon: '⚡', effect: 10000 },
            { type: 'shield', color: '#00ffff', icon: '🛡️', effect: 8000 }
        ];
        
        const powerup = powerupTypes[Math.floor(Math.random() * powerupTypes.length)];
        
        this.powerups.push({
            x,
            y,
            width: 30,
            height: 30,
            ...powerup
        });
    }
    
    shoot() {
        const now = Date.now();
        const cooldown = this.powerupsActive.rapidFire.active ? 100 : this.bulletCooldown;
        
        if (now - this.lastBulletTime > cooldown) {
            this.bullets.push({
                x: this.player.x + this.player.width / 2 - 2.5,
                y: this.player.y,
                width: 5,
                height: 15,
                speed: 7,
                color: '#ffff00'
            });
            
            this.lastBulletTime = now;
        }
    }
    
    update() {
        if (this.gameState !== 'playing') return;
        
        // Update player position
        if (this.keys['ArrowLeft'] || this.keys['KeyA']) {
            this.player.x = Math.max(0, this.player.x - this.player.speed);
        }
        if (this.keys['ArrowRight'] || this.keys['KeyD']) {
            this.player.x = Math.min(this.canvas.width - this.player.width, this.player.x + this.player.speed);
        }
        if (this.keys['ArrowUp'] || this.keys['KeyW']) {
            this.player.y = Math.max(0, this.player.y - this.player.speed);
        }
        if (this.keys['ArrowDown'] || this.keys['KeyS']) {
            this.player.y = Math.min(this.canvas.height - this.player.height, this.player.y + this.player.speed);
        }
        
        // Shoot with spacebar
        if (this.keys['Space']) {
            this.shoot();
        }
        
        // Update bullets
        this.bullets = this.bullets.filter(bullet => {
            bullet.y -= bullet.speed;
            return bullet.y > -bullet.height;
        });
        
        // Update enemies
        for (let i = this.enemies.length - 1; i >= 0; i--) {
            const enemy = this.enemies[i];
            enemy.y += enemy.speed;
            
            // Check collision with player
            if (this.checkCollision(this.player, enemy)) {
                if (!this.powerupsActive.shield.active) {
                    this.player.health -= 10;
                    this.updateUI();
                }
                this.createExplosion(enemy.x + enemy.width/2, enemy.y + enemy.height/2);
                this.enemies.splice(i, 1);
                continue;
            }
            
            // Check collision with bullets
            for (let j = this.bullets.length - 1; j >= 0; j--) {
                const bullet = this.bullets[j];
                if (this.checkCollision(bullet, enemy)) {
                    enemy.health -= 10;
                    this.bullets.splice(j, 1);
                    
                    if (enemy.health <= 0) {
                        this.score += enemy.points;
                        this.enemiesDestroyed++;
                        this.spawnPowerup(enemy.x, enemy.y);
                        this.createExplosion(enemy.x + enemy.width/2, enemy.y + enemy.height/2);
                        this.enemies.splice(i, 1);
                        
                        // Level up every 10 enemies
                        if (this.enemiesDestroyed % 10 === 0) {
                            this.level++;
                            this.enemySpawnRate = Math.max(500, this.enemySpawnRate - 200);
                        }
                    }
                    break;
                }
            }
            
            // Remove if off screen
            if (enemy.y > this.canvas.height) {
                this.enemies.splice(i, 1);
            }
        }
        
        // Update power-ups
        for (let i = this.powerups.length - 1; i >= 0; i--) {
            const powerup = this.powerups[i];
            powerup.y += 2;
            
            if (this.checkCollision(this.player, powerup)) {
                this.activatePowerup(powerup);
                this.powerups.splice(i, 1);
            } else if (powerup.y > this.canvas.height) {
                this.powerups.splice(i, 1);
            }
        }
        
        // Update explosions
        this.explosions = this.explosions.filter(explosion => {
            explosion.lifetime--;
            return explosion.lifetime > 0;
        });
        
        // Update active power-ups
        const now = Date.now();
        Object.keys(this.powerupsActive).forEach(key => {
            const powerup = this.powerupsActive[key];
            if (powerup.active) {
                powerup.duration -= 16; // Approximate frame time
                if (powerup.duration <= 0) {
                    powerup.active = false;
                }
            }
        });
        
        // Update UI
        this.updateUI();
        
        // Check game over
        if (this.player.health <= 0) {
            this.gameOver();
        }
    }
    
    activatePowerup(powerup) {
        switch (powerup.type) {
            case 'health':
                this.player.health = Math.min(this.player.maxHealth, this.player.health + powerup.effect);
                break;
            case 'rapidFire':
                this.powerupsActive.rapidFire.active = true;
                this.powerupsActive.rapidFire.duration = powerup.effect;
                break;
            case 'shield':
                this.powerupsActive.shield.active = true;
                this.powerupsActive.shield.duration = powerup.effect;
                break;
        }
    }
    
    createExplosion(x, y) {
        this.explosions.push({
            x,
            y,
            radius: 10,
            maxRadius: 40,
            lifetime: 30
        });
    }
    
    checkCollision(obj1, obj2) {
        return obj1.x < obj2.x + obj2.width &&
               obj1.x + obj1.width > obj2.x &&
               obj1.y < obj2.y + obj2.height &&
               obj1.y + obj1.height > obj2.y;
    }
    
    updateUI() {
        // Update score
        document.getElementById('score').textContent = this.score;
        
        // Update health
        const healthPercent = (this.player.health / this.player.maxHealth) * 100;
        document.getElementById('health-fill').style.width = `${healthPercent}%`;
        document.getElementById('health-text').textContent = `${Math.round(healthPercent)}%`;
        
        // Update level
        document.getElementById('level').textContent = this.level;
        
        // Update stats
        document.getElementById('enemiesDestroyed').textContent = this.enemiesDestroyed;
        const survivalTime = Math.floor((Date.now() - this.startTime) / 1000);
        document.getElementById('survivalTime').textContent = `${survivalTime}s`;
        
        // Update power-up timers
        const rapidFireTime = Math.max(0, Math.ceil(this.powerupsActive.rapidFire.duration / 1000));
        const shieldTime = Math.max(0, Math.ceil(this.powerupsActive.shield.duration / 1000));
        
        const rapidFireEl = document.getElementById('rapidFireStatus');
        const shieldEl = document.getElementById('shieldStatus');
        
        rapidFireEl.querySelector('span').textContent = `${rapidFireTime}s`;
        shieldEl.querySelector('span').textContent = `${shieldTime}s`;
        
        rapidFireEl.style.display = this.powerupsActive.rapidFire.active ? 'flex' : 'none';
        shieldEl.style.display = this.powerupsActive.shield.active ? 'flex' : 'none';
    }
    
    draw() {
        // Clear canvas
        this.ctx.fillStyle = '#001122';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw stars
        this.drawStars();
        
        // Draw player
        this.ctx.save();
        if (this.powerupsActive.shield.active) {
            this.ctx.strokeStyle = '#00ffff';
            this.ctx.lineWidth = 3;
            this.ctx.beginPath();
            this.ctx.arc(
                this.player.x + this.player.width/2,
                this.player.y + this.player.height/2,
                this.player.width/2 + 10,
                0,
                Math.PI * 2
            );
            this.ctx.stroke();
        }
        
        // Draw player plane
        this.ctx.fillStyle = this.player.color;
        this.ctx.fillRect(this.player.x, this.player.y, this.player.width, this.player.height);
        
        // Draw plane details
        this.ctx.fillStyle = '#ffffff';
        this.ctx.fillRect(this.player.x + 10, this.player.y + 15, 30, 20);
        this.ctx.fillStyle = '#ff0000';
        this.ctx.fillRect(this.player.x + 15, this.player.y + 20, 20, 10);
        this.ctx.restore();
        
        // Draw bullets
        this.bullets.forEach(bullet => {
            this.ctx.fillStyle = bullet.color;
            this.ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
            
            // Add glow effect
            this.ctx.shadowColor = bullet.color;
            this.ctx.shadowBlur = 10;
            this.ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
            this.ctx.shadowBlur = 0;
        });
        
        // Draw enemies
        this.enemies.forEach(enemy => {
            this.ctx.fillStyle = enemy.color;
            this.ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
            
            // Draw enemy health bar
            const healthPercent = enemy.health / (enemy.type === 'tank' ? 50 : enemy.type === 'fast' ? 10 : 20);
            this.ctx.fillStyle = '#ff0000';
            this.ctx.fillRect(enemy.x, enemy.y - 10, enemy.width, 5);
            this.ctx.fillStyle = '#00ff00';
            this.ctx.fillRect(enemy.x, enemy.y - 10, enemy.width * healthPercent, 5);
        });
        
        // Draw power-ups
        this.powerups.forEach(powerup => {
            this.ctx.save();
            this.ctx.fillStyle = powerup.color;
            this.ctx.beginPath();
            this.ctx.arc(
                powerup.x + powerup.width/2,
                powerup.y + powerup.height/2,
                powerup.width/2,
                0,
                Math.PI * 2
            );
            this.ctx.fill();
            
            // Draw icon
            this.ctx.font = '20px Arial';
            this.ctx.fillStyle = '#ffffff';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText(
                powerup.icon,
                powerup.x + powerup.width/2,
                powerup.y + powerup.height/2
            );
            this.ctx.restore();
        });
        
        // Draw explosions
        this.explosions.forEach(explosion => {
            const radius = explosion.radius + 
                         (explosion.maxRadius - explosion.radius) * 
                         (1 - explosion.lifetime / 30);
            
            const gradient = this.ctx.createRadialGradient(
                explosion.x, explosion.y, 0,
                explosion.x, explosion.y, radius
            );
            gradient.addColorStop(0, '#ffff00');
            gradient.addColorStop(0.5, '#ff8800');
            gradient.addColorStop(1, 'rgba(255, 0, 0, 0)');
            
            this.ctx.fillStyle = gradient;
            this.ctx.beginPath();
            this.ctx.arc(explosion.x, explosion.y, radius, 0, Math.PI * 2);
            this.ctx.fill();
        });
        
        // Draw HUD
        this.drawHUD();
    }
    
    drawStars() {
        for (let i = 0; i < 50; i++) {
            const x = (Date.now() / 100 + i * 100) % this.canvas.width;
            const y = (i * 20) % this.canvas.height;
            const size = Math.random() * 2;
            
            this.ctx.fillStyle = '#ffffff';
            this.ctx.beginPath();
            this.ctx.arc(x, y, size, 0, Math.PI * 2);
            this.ctx.fill();
        }
    }
    
    drawHUD() {
        // Draw score
        this.ctx.font = '20px Orbitron';
        this.ctx.fillStyle = '#ffffff';
        this.ctx.textAlign = 'left';
        this.ctx.fillText(`SCORE: ${this.score}`, 10, 30);
        this.ctx.fillText(`LEVEL: ${this.level}`, 10, 60);
        
        // Draw health bar
        const healthPercent = this.player.health / this.player.maxHealth;
        this.ctx.fillStyle = '#ff0000';
        this.ctx.fillRect(10, this.canvas.height - 30, 200, 20);
        this.ctx.fillStyle = '#00ff00';
        this.ctx.fillRect(10, this.canvas.height - 30, 200 * healthPercent, 20);
        this.ctx.strokeStyle = '#ffffff';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(10, this.canvas.height - 30, 200, 20);
        
        // Draw health text
        this.ctx.fillStyle = '#ffffff';
        this.ctx.fillText(`HEALTH: ${Math.round(this.player.health)}%`, 220, this.canvas.height - 15);
    }
    
    gameOver() {
        this.gameState = 'gameover';
        document.getElementById('finalScore').textContent = this.score;
        document.getElementById('highScoreInput').style.display = this.score > 0 ? 'block' : 'none';
    }
    
    handleKeyDown(e) {
        this.keys[e.code] = true;
        
        // Pause with P key
        if (e.code === 'KeyP') {
            this.togglePause();
            e.preventDefault();
        }
        
        // Start game with Enter from start screen
        if (e.code === 'Enter' && this.gameState === 'start') {
            this.startGame();
        }
    }
    
    handleKeyUp(e) {
        this.keys[e.code] = false;
    }
    
    gameLoop() {
        // Update game state
        this.update();
        
        // Draw everything
        this.draw();
        
        // Control screen visibility
        this.updateScreens();
        
        // Request next frame
        requestAnimationFrame(() => this.gameLoop());
    }
    
    updateScreens() {
        const startScreen = document.getElementById('startScreen');
        const pauseScreen = document.getElementById('pauseScreen');
        const gameOverScreen = document.getElementById('gameOverScreen');
        
        startScreen.style.display = this.gameState === 'start' ? 'flex' : 'none';
        pauseScreen.style.display = this.gameState === 'paused' ? 'flex' : 'none';
        gameOverScreen.style.display = this.gameState === 'gameover' ? 'flex' : 'none';
    }
}

// Global functions for HTML buttons
let game;

window.onload = () => {
    game = new PlaneGame();
};

function startGame() {
    game.startGame();
}

function togglePause() {
    game.togglePause();
}

function restartGame() {
    game.restartGame();
}

function saveHighScore() {
    game.saveHighScore();
}