let board;
let cols = 4;
let rows = 4;
let score = 0;
let gameOver = false;


window.onload = function () {
    document.getElementById('new-game').addEventListener('click', newGame);
    setGame();
}

const setGame = () => {
    board = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ]

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            //<div id='0-0'></div>
            let tile = document.createElement('div');
            tile.id = r.toString() + '-' + c.toString();
            let number = board[r][c];
            updateTiles(tile, number);
            document.getElementById('board').appendChild(tile);
        }
    }

    setRand();
    setRand();
    setRand();
}

const hasEmptyTile = () => {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (board[r][c] == 0) {
                return true;
            }
        }
    }
    return false;
}

const canMerge = () => {
    // Check horizontal merges
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols - 1; c++) {
            if (board[r][c] == board[r][c + 1]) {
                return true;
            }
        }
    }
    // Check vertical merges
    for (let c = 0; c < cols; c++) {
        for (let r = 0; r < rows - 1; r++) { 
            if (board[r][c] == board[r + 1][c]) {
                return true;
            }
        }
    }
    return false;
}

const isGameOver = () => {
    return !hasEmptyTile() && !canMerge();
}

const setRand = () => {
    if (!hasEmptyTile()) return;

    let found = false;
    while (!found) {
        //random r-c
        let r = Math.floor(Math.random() * rows); //0-1 * 4 --> 0, 3
        let c = Math.floor(Math.random() * cols);

        if (board[r][c] == 0) {
            board[r][c] = 2;
            let tile = document.getElementById(r.toString() + '-' + c.toString());
            tile.innerText = '2';
            tile.classList.add('x2');
            found = true;
        }
    }
}

const updateTiles = (tile, number) => {
    tile.innerText = '';
    tile.classList.value = '';
    tile.classList.add('tile');
    if (number > 0) {
        tile.innerText = number;
        if (number <= 4096) {
            tile.classList.add('x' + number.toString());
        } else {
            tile.classList.add('x8192');
        }
    }
}

document.addEventListener('keyup', (e) => {
    let moved = false;
    if (e.code == 'ArrowLeft' || e.code == 'KeyA') {
        moveLeft();
        setRand();
        moved = true;
    } else if (e.code == 'ArrowRight' || e.code == 'KeyD') {
        moveRight();
        setRand();
        moved = true;
    } else if (e.code == 'ArrowUp' || e.code == 'KeyW') {
        moveUp();
        setRand();
        moved = true;
    } else if (e.code == 'ArrowDown' || e.code == 'KeyS') {
        moveDown();
        setRand();
        moved = true;
    }

    if(moved) {
        setRand();
        let scoreText = document.getElementById('score');
        scoreText.innerText = 'Score: ' + score;
        scoreText.style.color = '#ff0';

        if (isGameOver()) {
            displayGameOver();
        }
    }
});

const displayGameOver = () => {
    let gameOverText = document.getElementById('score');
    gameOverText.innerText = 'Game Over!';
    gameOverText.style.color = '#c00';
}


const filterZero = (row) => {
    return row.filter(number => number != 0); //create new array without zero elements
}

const slide = (row) => {
    row = filterZero(row); //get grid of zeroes --> [2, 2, 2]

    //slide
    for (let i = 0; i < row.length; i++) {
        //check every 2
        if (row[i] == row[i + 1]) {
            row[i] = row[i] * 2;
            row[i + 1] = 0;
            score += row[i];
        } //[2, 2, 2] --> [4, 0, 2]
    }

    row = filterZero(row); //[4, 2]

    //add zeroes
    while (row.length < cols) {
        row.push(0);
    } //[4, 2, 0, 0]

    return row;
}

const moveLeft = () => {
    for (let r = 0; r < rows; r++) {
        let row = board[r];
        row = slide(row);
        board[r] = row;

        for (let c = 0; c < cols; c++) {
            let tile = document.getElementById(r.toString() + '-' + c.toString());
            let number = board[r][c];
            updateTiles(tile, number);
        }
    }
}

const moveRight = () => {
    for (let r = 0; r < rows; r++) {
        let row = board[r];
        row.reverse();
        row = slide(row);
        row.reverse();
        board[r] = row;

        for (let c = 0; c < cols; c++) {
            let tile = document.getElementById(r.toString() + '-' + c.toString());
            let number = board[r][c];
            updateTiles(tile, number);
        }
    }
}

const moveUp = () => {
    for (let c = 0; c < cols; c++) {
        let row = [board[0][c], board[1][c], board[2][c], board[3][c]];
        row = slide(row);
        for (let r = 0; r < rows; r++) {
            board[r][c] = row[r];
            let tile = document.getElementById(r.toString() + '-' + c.toString());
            let number = board[r][c];
            updateTiles(tile, number);
        }
    }
}

const moveDown = () => {
    for (let c = 0; c < cols; c++) {
        let row = [board[0][c], board[1][c], board[2][c], board[3][c]];
        row.reverse();
        row = slide(row);
        row.reverse();
        for (let r = 0; r < rows; r++) {
            board[r][c] = row[r];
            let tile = document.getElementById(r.toString() + '-' + c.toString());
            let number = board[r][c];
            updateTiles(tile, number);
        }
    }
}

const newGame = () => {
    board = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ];
    score = 0;
    gameOver = false;
    let scoreDefault = document.getElementById('score');
    scoreDefault.innerText = 'Score: ' + score;
    scoreDefault.style.color = '#eee';

    const boardElement = document.getElementById('board');
    while (boardElement.firstChild) {
        boardElement.removeChild(boardElement.firstChild);
    }
    setGame();
}
