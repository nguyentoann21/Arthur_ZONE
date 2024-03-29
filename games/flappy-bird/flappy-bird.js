//define board
let board;
let boardWidth = window.innerWidth;
let boardHeight = window.innerHeight;
let context;

//define bird
let birdWidth = 47;
let birdHeight = 34;
let birdX = boardWidth / 24;
let birdY = boardHeight / 2;
let birdImg;

let bird = {
    x: birdX,
    y: birdY,
    width: birdWidth,
    height: birdHeight
}

//pipes
let pipeArray = [];
let pipeWidth = 64;
let pipeHeight = 320;
let pipeX = boardWidth;
let pipeY = 0;
let pipeUpImg;
let pipeDownImg;

//physics
let velocityX = -2; //pipes moving left speed
let velocityY = 0; //bird jump speed
let gravity = 0.8;

//gameOver
let gameOver = false;

//score
let score = 0;

//trigger game start
let gameStarted = false;

window.onload = function () {
    board = document.getElementById("board");
    board.width = boardWidth;
    board.height = boardHeight;
    context = board.getContext("2d"); // using for drawing on the board

    //load the bird image
    birdImg = new Image();
    birdImg.onload = function () {
        context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
    };
    birdImg.src = "./assets/stupid-bird.png";

    pipeUpImg = new Image();
    pipeUpImg.src = "./assets/flappy-bird-pipe-up.png";

    pipeDownImg = new Image();
    pipeDownImg.src = "./assets/flappy-bird-pipe-down.png";

    requestAnimationFrame(updateAction);
    setInterval(placePipes, 1500) //every 1.5 seconds
    document.body.addEventListener("keydown", moveBird);
};

const updateAction = () => {
    requestAnimationFrame(updateAction);
    if (gameOver) return;
    context.clearRect(0, 0, boardWidth, boardHeight);

    //set-up the game started
    if (gameStarted) {
        //bird
        velocityY += gravity;
        bird.y = Math.max(bird.y + velocityY, 0); //apply gravity top current bird.y, limit the bird.y to tope of canvas

        if (bird.y + bird.height > boardHeight) gameOver = true;
    }

    context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);

    //pipes
    for (let i = 0; i < pipeArray.length; i++) {
        let pipe = pipeArray[i];
        pipe.x += velocityX;
        context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);

        if (!pipe.passed && bird.x > pipe.x + pipe.width) {
            score += 2.5; //becase there are 2 pipes! so 2.5*2 = 5 per 1 set of pipes
            pipe.passed = true;
        }

        if (detectCollision(bird, pipe)) gameOver = true;
    }

    //clear pipes
    while (pipeArray.length > 0 && pipeArray[0].x < -pipeWidth) {
        pipeArray.shift(); //remove first element from array
    }

    //score
    // Set text properties
    context.font = "36px Arial";
    context.textAlign = "left";
    const scoreText = "Score: " + score;

    // Measure text to calculate background width
    const textMetrics = context.measureText(scoreText);
    const textWidth = textMetrics.width;
    const padding = 10; // Add some padding around the text
    const backgroundWidth = textWidth + (padding * 2); // Total background width
    const backgroundHeight = 50; // Arbitrary height, adjust as needed
    const borderRadius = 10; // Radius of the corners of the background

    // Draw rounded rectangle background
    context.fillStyle = "#333";
    // Start path
    context.beginPath();
    // Top left corner
    context.moveTo(5 + borderRadius, 5);
    // Line to top right corner
    context.lineTo(5 + backgroundWidth - borderRadius, 5);
    // Quadratic curve for top right corner
    context.quadraticCurveTo(5 + backgroundWidth, 5, 5 + backgroundWidth, 5 + borderRadius);
    // Line to bottom right corner
    context.lineTo(5 + backgroundWidth, 5 + backgroundHeight - borderRadius);
    // Quadratic curve for bottom right corner
    context.quadraticCurveTo(5 + backgroundWidth, 5 + backgroundHeight, 5 + backgroundWidth - borderRadius, 5 + backgroundHeight);
    // Line to bottom left corner
    context.lineTo(5 + borderRadius, 5 + backgroundHeight);
    // Quadratic curve for bottom left corner
    context.quadraticCurveTo(5, 5 + backgroundHeight, 5, 5 + backgroundHeight - borderRadius);
    // Line to top left corner
    context.lineTo(5, 5 + borderRadius);
    // Quadratic curve for top left corner
    context.quadraticCurveTo(5, 5, 5 + borderRadius, 5);
    // Fill the background
    context.fill();

    // Draw score text over the rounded rectangle
    context.fillStyle = "yellow";
    context.fillText(scoreText, 5 + padding, 40); // Adjust the Y coordinate as needed to vertically center the text


    if (gameOver) {
        context.font = '80px serif';
        context.textAlign = "center";
        context.fillStyle = "red";
        context.fillText("Game Over", boardWidth / 2, boardHeight / 2);
    }
}

const placePipes = () => {

    //random pipes
    //(0-1) * (pipeHeight/2)
    //0 -> -128 (pipeHeight/4)
    //1 -> -128 -256 (pipeHeight/4) - pipeHeight/2) = -3/4 pipeHeight
    let randomPipeY = pipeY - pipeHeight / 4 - Math.random() * (pipeHeight / 2);
    let openSpace = board.height / 3;

    let pipeDown = {
        img: pipeDownImg,
        x: pipeX,
        y: randomPipeY,
        width: pipeWidth,
        height: pipeHeight,
        passed: false,
    }
    pipeArray.push(pipeDown);

    let pipeUp = {
        img: pipeUpImg,
        x: pipeX,
        y: randomPipeY + pipeHeight + openSpace,
        width: pipeWidth,
        height: pipeHeight,
        passed: false,
    }
    pipeArray.push(pipeUp);
}

const moveBird = (e) => {
    if (e.code == "Space" || e.code == "ArrowUp" || e.code == "KeyW") {
        //start a new game
        if (!gameStarted) gameStarted = true;

        //bird jump
        velocityY = -10;

        //reset game
        if (gameOver) {
            bird.y = birdY;
            pipeArray = [];
            score = 0;
            gameOver = false;
            gameStarted = false;
        }
    }
}

const detectCollision = (a, b) => {
    return a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y;
}