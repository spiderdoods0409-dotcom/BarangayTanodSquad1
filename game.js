const canvas = document.createElement('canvas');
canvas.width = 800;
canvas.height = 400;
document.body.appendChild(canvas);
const ctx = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);


const player1Sprites = {
    idle: new Image(),
    run: new Image(),
    punch: new Image()
};
player1Sprites.idle.src = 'sprites/player1/idle.png';
player1Sprites.run.src = 'sprites/player1/Run.png';
player1Sprites.punch.src = 'sprites/player1/punch.png';

const player2Sprites = {
    idle: new Image(),
    run: new Image(),
    punch: new Image()
};
player2Sprites.idle.src = 'sprites/player2/idle.png';
player2Sprites.run.src = 'sprites/player2/Run.png';
player2Sprites.punch.src = 'sprites/player2/punch.png';
let imagesLoaded = 0;

function checkImagesLoaded() {
    imagesLoaded++;
    if (imagesLoaded === 2) {
        gameLoop();
    
    }
}

{
let imagesLoaded = 0;
const totalImages = 6;

function checkImagesLoaded() {
    imagesLoaded++;
    if (imagesLoaded === totalImages) {
        gameLoop();
    }
}
}

Object.values(player1Sprites).forEach(img => img.onload = checkImagesLoaded);
Object.values(player2Sprites).forEach(img => img.onload = checkImagesLoaded);



class Fighter {
    constructor(x, color, controls, sprites, frames) {
        this.x = x;
        this.y = 270;
        this.width = 64;
        this.height = 80;
        this.hp = 100;
        this.speed = 5;
        this.color = color;
        this.controls = controls;
        this.sprites = sprites;
        this.frames = frames;
        this.action = 'idle';
        this.frame = 0;
        this.frameTimer = 0;
        this.frameInterval = 10; // Lower = faster animation
        this.isPunching = false;
    }
    draw() {
    const img = this.sprites[this.action];
    const frameCount = this.frames[this.action];
    const frameWidth = img.width / frameCount;

    if (this === player2) {
        // Mirror horizontally for player2
        ctx.save();
        ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
        ctx.scale(-1, 1);
        ctx.drawImage(
            img,
            frameWidth * this.frame, 0, frameWidth, img.height,
            -this.width / 2, -this.height / 2, this.width, this.height
        );
        ctx.restore();
    } else {
        // Normal draw for player1
        ctx.drawImage(
            img,
            frameWidth * this.frame, 0, frameWidth, img.height,
            this.x, this.y, this.width, this.height
        );
    }
    ctx.fillStyle = 'red';
    ctx.fillRect(this.x, this.y - 20, this.hp / 2, 10);
}
    update() {
        // Animate frames
        this.frameTimer++;
        if (this.frameTimer >= this.frameInterval) {
            this.frameTimer = 0;
            this.frame++;
            if (this.frame >= this.frames[this.action]) {
                this.frame = 0;
                if (this.action === 'punch') {
                    this.isPunching = false;
                    this.action = 'idle';
                }
            }
        }
    }
    punch(opponent) {
    if (!this.isPunching) {
        this.isPunching = true;
        this.action = 'punch';
        this.frame = 0;
        // Adjust hitbox here:
        const hitboxWidth = this.width * 0.3;   // 60% of sprite width
        const hitboxHeight = this.height * 0.7; // 70% of sprite height
        const hitboxX = this.x + this.width * 0.2; // Offset from left
        const hitboxY = this.y + this.height * 0.15; // Offset from top

        if (
            hitboxX < opponent.x + opponent.width &&
            hitboxX + hitboxWidth > opponent.x &&
            hitboxY < opponent.y + opponent.height &&
            hitboxY + hitboxHeight > opponent.y
        ) {
            opponent.hp -= 10;
            if (opponent.hp < 0) opponent.hp = 0;
        }
    }
}
}

const player1Frames = { idle: 6, run: 8, punch: 4 };
const player2Frames = { idle: 6, run: 8, punch: 4 };

const player1 = new Fighter(100, 'blue', { left: 'a', right: 'd', punch: 'w' }, player1Sprites, player1Frames);
const player2 = new Fighter(600, 'green', { left: 'ArrowLeft', right: 'ArrowRight', punch: 'ArrowUp' }, player2Sprites, player2Frames);



function handleInput(e, down) {
    [player1, player2].forEach(player => {
        if (e.key === player.controls.left && down) {
            player.x -= player.speed;
            player.action = 'run';
        }
        if (e.key === player.controls.right && down) {
            player.x += player.speed;
            player.action = 'run';
        }
        if (e.key === player.controls.punch && down) {
            player.punch(player === player1 ? player2 : player1);
            player.action = 'punch';
        }
        if (!down) player.action = 'idle';
    });
}

document.addEventListener('keydown', e => handleInput(e, true));

function handleInput(e, down) {
    [player1, player2].forEach(player => {
        if (e.key === player.controls.left && down && !player.isPunching) {
            player.x -= player.speed;
            player.action = 'run';
        }
        if (e.key === player.controls.right && down && !player.isPunching) {
            player.x += player.speed;
            player.action = 'run';
        }
        if (e.key === player.controls.punch && down) {
            player.punch(player === player1 ? player2 : player1);
        }
        if (!down && !player.isPunching) player.action = 'idle';
    });
}


function drawBackground() {
    ctx.fillStyle = '#222';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#444';
    ctx.fillRect(0, 350, canvas.width, 50);
}

function drawWinner() {
    if (player1.hp <= 0 || player2.hp <= 0) {
        ctx.fillStyle = 'yellow';
        ctx.font = '48px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(
            player1.hp <= 0 ? 'Player 2 Wins!' : 'Player 1 Wins!',
            canvas.width / 2,
            canvas.height / 2
        );
    }
}

function updatePlayer2AI() {
    if (player2.hp <= 0 || player1.hp <= 0) return;

    // Move towards player1
    if (player2.x > player1.x + player1.width) {
        player2.x -= player2.speed;
        player2.action = 'run';
    } else if (player2.x + player2.width < player1.x) {
        player2.x += player2.speed;
        player2.action = 'run';
    } else {
        // If close, punch randomly
        if (!player2.isPunching && Math.random() < 0.03) {
            player2.punch(player1);
        } else if (!player2.isPunching) {
            player2.action = 'idle';
        }
    }
}

function gameLoop() {
    drawBackground();
    player1.update();
    updatePlayer2AI();
    player2.update();
    player1.draw();
    player2.draw();
    drawWinner();
    if (player1.hp > 0 && player2.hp > 0) {
        requestAnimationFrame(gameLoop);
    }
}


gameLoop();
