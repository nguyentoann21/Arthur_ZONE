//board
let board;
let boardWidth = 500;
let boardHeight = 560;
let context;


//player
let playerHeight = 10;
let playerWidth = 100;
let playerVelocityX = 10;

let player = {
    x: boardWidth / 2 - playerWidth / 2,
    y: boardHeight - playerHeight - 5,
    width: playerWidth,
    height: playerHeight,
    velocityX: playerVelocityX
}

//ball
let ballWidth = 10;
let ballHeight = 10;
let ballVelocityX = 3;
let ballVelocityY = 2;

let ball = {
    x: boardWidth / 2,
    y: boardHeight / 2,
    width: ballWidth,
    height: ballHeight,
    velocityX: ballVelocityX,
    velocityY: ballVelocityY
}

//blocks
let blockArray = [];
let blockWidth = 50;
let blockHeight = 10;
let blockColumns = 8;
let blockRows = 8;
let blockMaxRows = 10;
let blockCount = 0;

//started with block corner top left
let blockX = 15;
let blockY = 45;

//others
let score = 0;
let gameOver = false;
let gameUpdate;
let winner = false;

window.onload = function () {
    document.getElementById('reset').addEventListener('click', resetGame);
    board = document.getElementById("board");
    board.width = boardWidth;
    board.height = boardHeight;
    context = board.getContext("2d"); //used for drawing on the board

    //draw initial player
    context.fillStyle = 'lightyellow';
    context.fillRect(player.x, player.y, player.width, player.height);

    requestAnimationFrame(update);
    document.addEventListener('keydown', movePlayer);

    //create blocks
    createBlocks();
}

const update = () => {
    gameUpdate = requestAnimationFrame(update);

    if (gameOver || winner) {
        let scoreElement = document.getElementById('score');
        if (winner) {
            scoreElement.innerText = "Congratulation, Winner!!!";
            scoreElement.style.color = "Yellow";
        }
        if (gameOver) {
            scoreElement.innerText = "Game Over";
            scoreElement.style.color = "red";
        }
        return;
    }

    context.clearRect(0, 0, board.width, board.height);

    //player
    context.fillStyle = 'lightblue';
    context.fillRect(player.x, player.y, player.width, player.height);

    //ball
    context.fillStyle = 'white';
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;
    context.beginPath(); // Starts a new path
    context.arc(ball.x, ball.y, ballWidth / 2, 0, Math.PI * 2);
    context.fillStyle = 'yellow';
    context.fill();

    //bound ball of walls
    if (ball.y <= 0) {
        //if ball touches top of canvas
        ball.velocityY *= -1;
    } else if (ball.x <= 0 || (ball.x + ball.width) >= boardWidth) {
        //if ball touches left or right of canvas
        ball.velocityX *= -1;
    } else if (ball.y + ball.height >= boardHeight) {
        //if ball touches bottom of canvas --> game Over
        gameOver = true;
    }

    //bounce the ball off player paddle
    if (topCollision(ball, player) || bottomCollision(ball, player)) {
        ball.velocityY *= -1;
    } else if (leftCollision(ball, player) || rightCollision(ball, player)) {
        ball.velocityX *= -1;
    }

    //blocks
    context.fillStyle = "skyblue";

    let blockCounter = 0;

    for (let i = 0; i < blockArray.length; i++) {
        let block = blockArray[i];
        if (!block.break) {
            blockCounter++;
            if (topCollision(ball, block) || bottomCollision(ball, block)) {
                block.break = true;
                ball.velocityY *= -1;
                blockCount -= 1;
                score += 100;
            } else if (leftCollision(ball, block) || rightCollision(ball, block)) {
                block.break = true;
                ball.velocityX *= -1;
                blockCount -= 1;
                score += 100;
            }

            context.fillRect(block.x, block.y, block.width, block.height);
        }
    }

    // Check if all blocks are broken (win condition)
    if (blockCounter === 0) {
        winner = true;
    }

    let scoreElement = document.getElementById('score');
    scoreElement.innerText = "Score: " + score.toString();
    scoreElement.style.color = "white";
}

const outOfBounds = (xPosition) => {
    return (xPosition < 0 || xPosition + playerWidth > boardWidth)
}

const movePlayer = (e) => {
    if (e.code == "ArrowLeft" || e.code == "KeyA") {
        //player.x -= player.velocityX;
        let nextPlayer = player.x - player.velocityX;
        if (!outOfBounds(nextPlayer)) {
            player.x = nextPlayer;
        }
    } else if (e.code == "ArrowRight" || e.code == "KeyD") {
        // player.x += player.velocityX;
        let nextPlayer = player.x + player.velocityX;
        if (!outOfBounds(nextPlayer)) {
            player.x = nextPlayer;
        }
    }
}

const detectCollision = (a, b) => {
    return a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y;
}

const topCollision = (ball, block) => {
    return detectCollision(ball, block) && (ball.height + ball.y) >= block.y;
}

const bottomCollision = (ball, block) => {
    return detectCollision(ball, block) && (block.height + block.y) >= ball.y;
}

const leftCollision = (ball, block) => {
    return detectCollision(ball, block) && (ball.width + ball.x) >= block.x;
}

const rightCollision = (ball, block) => {
    return detectCollision(ball, block) && (block.width + block.x) >= ball.x;
}

const createBlocks = () => {
    blockArray = [];
    for (let i = 0; i < blockColumns; i++) {
        for (let j = 0; j < blockRows; j++) {
            let block = {
                x: blockX + i * blockWidth + i * 10,
                y: blockY + j * blockHeight + j * 10,
                width: blockWidth,
                height: blockHeight,
                break: false
            }
            blockArray.push(block);
        }
    }
    blockCount = blockArray.length;
}

const resetGame = () => {
    if (gameUpdate) {
        cancelAnimationFrame(gameUpdate);
    }

    player.x = boardWidth / 2 - playerWidth / 2;
    player.y = boardHeight - playerHeight - 5;
    player.velocityX = playerVelocityX;

    ball.x = boardWidth / 2;
    ball.y = boardHeight / 2;
    ball.velocityX = ballVelocityX;
    ball.velocityY = ballVelocityY;

    createBlocks();

    score = 0;
    gameOver = false;
    winner = false;

    context.clearRect(0, 0, board.width, board.height);

    let scoreElement = document.getElementById('score');
    scoreElement.innerText = "Score: " + score.toString();
    scoreElement.style.color = "white";

    gameUpdate = requestAnimationFrame(update);
}