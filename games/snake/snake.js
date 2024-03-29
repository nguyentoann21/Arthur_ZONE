
//board
let blockSize = 25;
let rows = 23;
let columns = 30;
let board;
let context;

//snake head
let snakeX = blockSize * 5;
let snakeY = blockSize * 5;
let snakeBody = [];

let velocityX = 0;
let velocityY = 0;

//food
let foodX;
let foodY;

//other
let gameOver = false;
let score = 0;

window.onload = function () {
    board = document.getElementById('board');
    board.width = columns * blockSize;
    board.height = rows * blockSize;
    context = board.getContext('2d'); //used for drawing on the board

    placeFood();

    document.addEventListener('keyup', changeDirection);

    setInterval(update, 1000 / 10); //100 miliseconds to update
}

const update = function () {

    document.getElementById('reset').addEventListener('click', resetGame);
    if(gameOver) {
        let scoreElement = document.getElementById('score');
        scoreElement.innerText = "Game Over";
        scoreElement.style.color = "red";
        return;
    }

    context.clearRect(0, 0, board.width, board.height);

    // Drawing the food as a circle
    context.fillStyle = "red";
    context.beginPath();
    context.arc(foodX + blockSize / 2, foodY + blockSize / 2, blockSize / 2, 0, 2 * Math.PI);
    context.fill();

    if (snakeX == foodX && snakeY == foodY) {
        score += 10;
        snakeBody.push([snakeX, snakeY]);
        placeFood();
    }

    for (let i = snakeBody.length - 1; i > 0; i--) {
        snakeBody[i] = snakeBody[i - 1];
    }

    if (snakeBody.length) {
        snakeBody[0] = [snakeX, snakeY];
    }

    snakeX += velocityX * blockSize;
    snakeY += velocityY * blockSize;

    // Drawing the snake head as a circle
    context.fillStyle = "lime";
    context.beginPath();
    context.arc(snakeX + blockSize / 2, snakeY + blockSize / 2, blockSize / 2, 0, 2 * Math.PI);
    context.fill();

    // Drawing snake body segments as circles
    for (let i = 0; i < snakeBody.length; i++) {
        context.beginPath();
        context.arc(snakeBody[i][0] + blockSize / 2, snakeBody[i][1] + blockSize / 2, blockSize / 2, 0, 2 * Math.PI);
        context.fill();
    }

    // Game Over conditions
    if (snakeX <= 0 || snakeX >= (columns - 1) * blockSize || snakeY <= 0 || snakeY >= (rows - 1) * blockSize) gameOver = true;

    for (let i = 0; i < snakeBody.length; i++) {
        if (snakeX == snakeBody[i][0] && snakeY == snakeBody[i][1]) gameOver = true;
    }

    // gameOver and score
    if (!gameOver) {
        document.getElementById('score').innerText = "Score: " + score.toString();
    }

    document.getElementById('score').innerText = "Score: " + score.toString();
}


const changeDirection = (e) => {
    if ((e.code == "ArrowUp" || e.code == "KeyW") && velocityY != 1) {
        velocityX = 0;
        velocityY = -1;
    } else if ((e.code == "ArrowDown" || e.code == "KeyS") && velocityY != -1) {
        velocityX = 0;
        velocityY = 1;
    } else if ((e.code == "ArrowLeft" || e.code == "KeyA") && velocityX != 1) {
        velocityX = -1;
        velocityY = 0;
    } else if ((e.code == "ArrowRight" || e.code == "KeyD") && velocityX != -1) {
        velocityX = 1;
        velocityY = 0;
    }
}

const placeFood = () => {
    foodX = Math.floor(Math.random() * columns) * blockSize;
    foodY = Math.floor(Math.random() * rows) * blockSize;
}

const resetGame = () => {
    snakeX = blockSize * 5;
    snakeY = blockSize * 5;
    velocityX = 0;
    velocityY = 0;
    snakeBody = [];
    score = 0;
    gameOver = false;

    placeFood();

    context.clearRect(0, 0, board.width, board.height);

    let scoreElement = document.getElementById('score');
    scoreElement.innerText = "Score: " + score.toString();
    scoreElement.style.color = "yellow";
}
