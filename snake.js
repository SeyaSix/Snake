const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const box = 20;
let snake = [{ x: 9 * box, y: 10 * box }];
let direction = null;
let food = spawnFood();
let score = 0;
let gameInterval;

function drawNeonRect(x, y, color) {
    ctx.shadowColor = color;
    ctx.shadowBlur = 20;
    ctx.fillStyle = color;
    ctx.fillRect(x, y, box, box);
    ctx.shadowBlur = 0;
}

function draw() {

    ctx.fillStyle = '#11131a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);


    for (let i = 0; i < snake.length; i++) {
        drawNeonRect(snake[i].x, snake[i].y, i === 0 ? '#00fff7' : '#00bfff');
    }


    drawNeonRect(food.x, food.y, '#ff00ea');


    document.getElementById('score').innerText = 'Score : ' + score;
}

function update() {
    let head = { x: snake[0].x, y: snake[0].y };

    switch (direction) {
        case 'LEFT': head.x -= box; break;
        case 'UP': head.y -= box; break;
        case 'RIGHT': head.x += box; break;
        case 'DOWN': head.y += box; break;
        default: return;
    }

 
    if (head.x < 0) head.x = canvas.width - box;
    else if (head.x >= canvas.width) head.x = 0;
    if (head.y < 0) head.y = canvas.height - box;
    else if (head.y >= canvas.height) head.y = 0;


    if (collision(head, snake)) {
        clearInterval(gameInterval);
        ctx.font = '2em Orbitron, Arial';
        ctx.fillStyle = '#ff00ea';
        ctx.textAlign = 'center';
        ctx.shadowColor = '#ff00ea';
        ctx.shadowBlur = 20;
        ctx.fillText('Game Over', canvas.width / 2, canvas.height / 2);
        return;
    }

    snake.unshift(head);


    if (head.x === food.x && head.y === food.y) {
        score++;
        food = spawnFood();
    } else {
        snake.pop();
    }

    draw();
}

function collision(head, array) {
    for (let i = 0; i < array.length; i++) {
        if (head.x === array[i].x && head.y === array[i].y) {
            return true;
        }
    }
    return false;
}

function spawnFood() {
    let x, y;
    do {
        x = Math.floor(Math.random() * (canvas.width / box)) * box;
        y = Math.floor(Math.random() * (canvas.height / box)) * box;
    } while (snake.some(segment => segment.x === x && segment.y === y));
    return { x, y };
}

function restartGame() {
    clearInterval(gameInterval);
    snake = [{ x: 9 * box, y: 10 * box }];
    direction = null;
    score = 0;
    food = spawnFood();
    draw();
    gameInterval = null;
}

function moveDirection(dir) {
    switch (dir) {
        case 'LEFT':
            if (direction !== 'RIGHT') direction = 'LEFT';
            break;
        case 'UP':
            if (direction !== 'DOWN') direction = 'UP';
            break;
        case 'RIGHT':
            if (direction !== 'LEFT') direction = 'RIGHT';
            break;
        case 'DOWN':
            if (direction !== 'UP') direction = 'DOWN';
            break;
    }
    if (!gameInterval && direction) {
        gameInterval = setInterval(update, 100);
    }
}

window.addEventListener('keydown', e => {
    switch (e.key) {
        case 'ArrowLeft':
        case 'q':
        case 'Q':
            if (direction !== 'RIGHT') direction = 'LEFT';
            break;
        case 'ArrowUp':
        case 'z':
        case 'Z':
            if (direction !== 'DOWN') direction = 'UP';
            break;
        case 'ArrowRight':
        case 'd':
        case 'D':
            if (direction !== 'LEFT') direction = 'RIGHT';
            break;
        case 'ArrowDown':
        case 's':
        case 'S':
            if (direction !== 'UP') direction = 'DOWN';
            break;
    }
    if (!gameInterval && direction) {
        gameInterval = setInterval(update, 100);
    }
});


['btnUp', 'btnDown', 'btnLeft', 'btnRight'].forEach(id => {
    const btn = document.getElementById(id);
    if (btn) {
        btn.addEventListener('touchstart', function(e) {
            e.preventDefault();
            switch (id) {
                case 'btnUp': moveDirection('UP'); break;
                case 'btnDown': moveDirection('DOWN'); break;
                case 'btnLeft': moveDirection('LEFT'); break;
                case 'btnRight': moveDirection('RIGHT'); break;
            }
        }, { passive: false });
    }
});

draw(); 