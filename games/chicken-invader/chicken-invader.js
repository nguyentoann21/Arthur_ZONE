let reset = null;

//board
let tileSize = 32;
let rows = 18;
let columns = 28;

let board;

let boardWidth = tileSize * columns;
let boardHeight = tileSize * rows;
let context;

//ship
let shipWidth = tileSize * 2;
let shipHeight = tileSize * 1.5;
let shipX = tileSize * columns / 2 - tileSize;
let shipY = tileSize * rows - tileSize * 2;

let ship = {
    x: shipX,
    y: shipY,
    width: shipWidth,
    height: shipHeight
}

let shipImg;
let velocityX = tileSize; //ship moving speed

//aliens chickens
let alienArray = [];
let alienWidth = tileSize * 2;
let alienHeight = tileSize * 2;
let alienX = tileSize;
let alienY = tileSize;
let alienImg;
let alienImgSuper;
let alienImgMilitary;
let alienRows = 2;
let alienColumns = 4;
let alienCount = 0; //number of aliens to defeat
let alienVelocityX = 1; //alien chicken moving speed

//bullets
let bulletImg;
let bulletArray = [];
let bulletVelocityY = -10; //bullet moving speed

//others
let score = 0;
let gameOver = false;
let level = 1;
let winner = false;

window.onload = function () {
    document.getElementById('new-game').addEventListener('click', resetGame);
    board = document.getElementById("board");
    board.width = boardWidth;
    board.height = boardHeight;
    context = board.getContext("2d");//used for drawing on the board

    //load shipImg
    shipImg = new Image();
    shipImg.onload = function () {
        context.drawImage(shipImg, ship.x, ship.y, shipWidth, shipHeight);
    }
    shipImg.src = "./assets/shooter.png";

    //load alien chickens
    alienImg = new Image();
    alienImg.src = "./assets/chicken-angry.png";

    alienImgSuper = new Image();
    alienImgSuper.src = "./assets/chicken-super.png";

    alienImgMilitary = new Image();
    alienImgMilitary.src = "./assets/chicken-military.png";

    spawnAlien();

    //load bullets
    bulletImg = new Image();
    bulletImg.src = "./assets/bullet.png";

    requestAnimationFrame(update);
    document.addEventListener("keydown", moveShip);
    document.addEventListener("keyup", shooting);
}

const update = () => {
    reset = requestAnimationFrame(update);

    if (gameOver) return;

    context.clearRect(0, 0, board.width, board.height);

    //ship
    context.drawImage(shipImg, ship.x, ship.y, shipWidth, shipHeight);

    //alien chickens
    for (let i = 0; i < alienArray.length; i++) {
        let alien = alienArray[i];
        if (alien.active) {
            alien.x += alienVelocityX;

            //the alien chicken touches the board border
            if (alien.x + alien.width > board.width || alien.x <= 0) {
                alienVelocityX *= -1;
                alien.x += alienVelocityX * 2;

                //moving all alien chickens up by one row
                for (let i = 0; i < alienArray.length; i++) {
                    alienArray[i].y += alienHeight;
                }
            }
            context.drawImage(alien.img, alien.x, alien.y, alien.width, alien.height);
            if (alien.y > ship.y) gameOver = true;
        }

        // Ship and alien chickens collision detection
        for (let k = 0; k < alienArray.length; k++) {
            let alien = alienArray[k];
            if (alien.active && detectCollision(ship, alien)) {
                gameOver = true;
            }
        }
    }

    //bullets
    for (let i = 0; i < bulletArray.length; i++) {
        let bullet = bulletArray[i];
        bullet.y += bulletVelocityY;
        // Draw the bullet image
        if (!bullet.used) {
            context.drawImage(bullet.img, bullet.x, bullet.y, bullet.width, bullet.height);
        }
        for (let j = 0; j < alienArray.length; j++) {
            let alien = alienArray[j];
            if (!bullet.used && alien.active && detectCollision(bullet, alien)) {
                bullet.used = true;
                alien.active = false;
                alienCount--;
                score += 100 * level;
            }
        }
    }

    //clear bullers
    while (bulletArray.length > 0 && (bulletArray[0].used || bulletArray[0].y < 0)) {
        bulletArray.shift(); //remove the first bullet(element) from the array
    }

    //next level

    if (alienCount == 0) {
        if (alienColumns < (columns / 2) - 1) {
            alienColumns++;
        } else {
            alienRows++;
        }

        if (alienRows >= (rows / 3) && alienColumns > (columns / 2) - 1) {
            winner = true;
            document.getElementById("score").innerText = "Congratulations, Winner !!!";
            return;
        }

        alienVelocityX += 0.2;
        alienArray = [];
        bulletArray = [];
        level++;
        spawnAlien();
    }

    //score
    document.getElementById('score').innerText = 'Score: ' + score.toString();
    if (gameOver) document.getElementById('score').innerText = 'Game Over - ' + score.toString();

    //level
    document.getElementById('level').innerText = 'Level: ' + level.toString();
}

const moveShip = (e) => {

    if (gameOver) return;

    if ((e.code == "ArrowLeft" || e.code == "KeyA")
        && ship.x - velocityX >= 0)
        ship.x -= velocityX; //moving to the left
    else if ((e.code == "ArrowRight" || e.code == "KeyD")
        && ship.x + velocityX + ship.width <= board.width)
        ship.x += velocityX; //moving to the right
}

const spawnAlien = () => {

    let selectImg;

    if (level % 15 === 0) {
        selectImg = alienImgSuper;
    }
    else if (level % 5 === 0) {
        selectImg = alienImgSuper;
    }
    else if (level % 3 === 0) {
        selectImg = alienImgMilitary;
    }
    else {
        selectImg = alienImg;
    }

    for (let i = 0; i < alienColumns; i++) {
        for (let j = 0; j < alienRows; j++) {
            let alien = {
                img: selectImg,
                x: alienX + i * alienWidth,
                y: alienY + j * alienHeight,
                width: alienWidth,
                height: alienHeight,
                active: true
            }
            alienArray.push(alien);
        }
    }
    alienCount = alienArray.length;
}

const shooting = (e) => {

    if (gameOver) return;

    if (e.code == "Space" || e.code == "KeyZ") {
        //shooting
        let bullet = {
            img: bulletImg,
            x: ship.x + shipWidth / 2.5 - (tileSize / 8) / 2,
            y: ship.y,
            width: tileSize / 2,
            height: tileSize,
            used: false
        }

        bulletArray.push(bullet);
    }
}

const detectCollision = function (a, b) {
    return a.x < b.x + b.width &&  //a's top left corner doesn't reach b's top right corner
        a.x + a.width > b.x &&     //a's top right corner passes b's top left corner
        a.y < b.y + b.height &&    //a's top left corner doesn't reach b's bottom left corner
        a.y + a.height > b.y;      //a's bottom left corner passes b's top left corner
}

const resetGame = () => {
    // Cancel the current game loop if it's running
    if (reset !== null) {
        cancelAnimationFrame(reset);
        reset = null;
    }

    // Reset game variables to their initial states
    score = 0;
    gameOver = false;
    winner = false;
    level = 1;
    alienArray = [];
    bulletArray = [];
    alienCount = 0;
    alienColumns = 4;
    alienRows = 2;
    alienVelocityX = 1;

    // Reset the ship's position
    ship.x = tileSize * columns / 2 - tileSize;
    ship.y = tileSize * rows - tileSize * 2;

    // Reset UI elements like score and level displays
    document.getElementById('score').innerText = 'Score: 0';
    document.getElementById('level').innerText = 'Level: 1';

    // Re-initialize game elements
    spawnAlien();

    // Start the game loop again
    update();
}