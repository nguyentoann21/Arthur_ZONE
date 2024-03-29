let currentMoleTile;
let currentPlantTile;
let score = 0;
let gameOver = false;
let moleInterval;
let plantInterval;

window.onload = function () {
    document.getElementById('new-game').addEventListener('click', resetGame);
    setGame();
};

const clearBoard = function() {
    document.getElementById('board').innerHTML = ''; // Clear the board
}

const resetGame = function () {
    gameOver = false;
    score = 0;
    document.getElementById('score').innerText = 'Score: 0'; // Reset score display
    document.getElementById('score').style.color = 'white'; // Reset score color
    clearBoard(); // Clear any existing game elements from the board
    clearInterval(moleInterval); // Clear existing mole interval
    clearInterval(plantInterval); // Clear existing plant interval
    setGame(); // Re-initialize the game
};

const setGame = function () {

    clearBoard();

    //setup the grid for the game board in html
    for (let i = 0; i < 9; i++) { //i goes from 0 to 8 and stop if over 8
        //<div id="0-8"></div>
        let tile = document.createElement('div');
        tile.id = i.toString();
        tile.addEventListener('click', selectTile);
        document.getElementById('board').appendChild(tile);
    }

    moleInterval = setInterval(setMole, 1000); //random a mole with every 1 seconds
    plantInterval = setInterval(setPlant, 1500); //random a mole with every 1.5 seconds
}

const getRandomTile = function () {
    //math random --> (0-9) * 9 = (0-9) --> round down to (0-8) integers
    let randNum = Math.floor(Math.random() * 9);
    return randNum.toString();
}

const setMole = function () {
    if (gameOver) return;

    if (currentMoleTile) currentMoleTile.innerHTML = "";

    let mole = document.createElement('img');
    mole.src = './assets/mole.png';

    let randNum = getRandomTile();
    let attempts = 0;

    // Try to find an unoccupied tile
    while (currentPlantTile && currentPlantTile.id === randNum && attempts < 9) {
        randNum = getRandomTile();
        attempts++;
    }

    if (attempts >= 9) return;

    if (currentPlantTile && currentMoleTile.id == randNum) return;

    currentMoleTile = document.getElementById(randNum);
    currentMoleTile.appendChild(mole);
}

const setPlant = function () {
    if (gameOver) return;

    if (currentPlantTile) currentPlantTile.innerHTML = "";

    let plant = document.createElement('img');
    plant.src = './assets/piranha-plant.png';

    let randNum = getRandomTile();
    
    let attempts = 0;

    // Try to find an unoccupied tile
    while (currentMoleTile && currentMoleTile.id === randNum && attempts < 9) {
        randNum = getRandomTile();
        attempts++;
    }

    if (attempts >= 9) return;

    if (currentMoleTile && currentMoleTile.id == randNum) return;

    currentPlantTile = document.getElementById(randNum);
    currentPlantTile.appendChild(plant);
}

const selectTile = function () {
    if (gameOver) return;

    if (this == currentMoleTile) {
        score += 10;
        const scoreElement = document.getElementById('score');
        scoreElement.innerText = 'Score: ' + score.toString(); // Update score
        scoreElement.style.color = 'white';
    } else if (this == currentPlantTile) {
        const scoreElement = document.getElementById('score');
        scoreElement.innerText = 'Game Over - ' + score.toString(); // Game Over
        scoreElement.style.color = 'red'; // Set text color to red
        gameOver = true;
    } else { }
}