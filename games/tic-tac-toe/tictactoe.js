let board;
let playerO = 'O';
let playerX = 'X';
let currentPlayer = playerO;
let gameOver = false;

window.onload = function () {
    document.getElementById('new-game').addEventListener('click', newGame);
    setGame();
}

const setGame = () => {
    board = [
        [' ', ' ', ' '],
        [' ', ' ', ' '],
        [' ', ' ', ' ']
    ]

    for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 3; c++) {
            //<div id='0-0'></div>
            let tile = document.createElement('div');
            tile.id = r.toString() + '-' + c.toString();
            tile.classList.add('tile');
            if(r == 0 || r == 1) tile.classList.add('horizontal-line');
            if(c == 0 || c == 1) tile.classList.add('vertical-line');

            tile.addEventListener('click', setTile);
            document.getElementById('board').appendChild(tile);
        }
    }
}

const setTile = (e) => {
    if(gameOver) return;

    let coords = e.target.id.split('-'); //'1-1' --> ['1', '1']
    let r = parseInt(coords[0]);
    let c = parseInt(coords[1]);

    if (board[r][c] != ' ') return;

    board [r][c] = currentPlayer;
    e.target.innerText = currentPlayer;

    if(currentPlayer == playerO) currentPlayer = playerX;
    else currentPlayer = playerO;

    checkWinner();
}

const checkWinner = () => {
    //horizontal line win
    for (let r = 0; r < 3; r++) {
        if (board[r][0] == board[r][1] && board[r][1] == board[r][2] && board[r][0] != ' ') {
            for (let i = 0; i < 3; i++) {
                let tile = document.getElementById(r.toString() + '-' + i.toString());
                tile.classList.add('winner');
            }
            gameOver = true;
            announceWinner(board[r][0]);
            return;
        }
    }

    //vertical line win
    for (let c = 0; c < 3; c++) {
        if (board[0][c] == board[1][c] && board[1][c] == board[2][c] && board[0][c] != ' ') {
            for (let i = 0; i < 3; i++) {
                let tile = document.getElementById(i.toString() + '-' + c.toString());
                tile.classList.add('winner');
            }
            gameOver = true;
            announceWinner(board[0][c]);
            return;
        }
    }

    
    //diagonally line win
    if (board[0][0] == board[1][1] && board[1][1] == board[2][2] && board[0][0] != ' ') {
        for (let i = 0; i < 3; i++) {
            let tile = document.getElementById(i.toString() + '-' + i.toString());
            tile.classList.add('winner');
        }
        gameOver = true;
        announceWinner(board[0][0]); 
        return;
    }

    //anti-diagonally
    if (board[0][2] == board[1][1] && board[1][1] == board[2][0] && board[0][2] != ' ') {
        //0-2
        let tile = document.getElementById('0-2');
        tile.classList.add('winner');

        tile = document.getElementById('1-1');
        tile.classList.add('winner');

        tile = document.getElementById('2-0');
        tile.classList.add('winner');

        gameOver = true;
        announceWinner(board[0][2]);
        return;
    }

    //draw
    let isDraw = true;

    for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 3; c++) {
            if (board[r][c] == ' ') {
                isDraw = false;
                break;
            }
        }
        if (!isDraw) break;
    }

    if (isDraw && !gameOver) { 
        let tile = document.getElementById('board');
        tile.classList.add('draw');
        gameOver = true; 
        setTimeout(() => {
            alert("It's a draw!");
        }, 100); 
    }
}

const newGame = () => {
    board = [
        [' ', ' ', ' '],
        [' ', ' ', ' '],
        [' ', ' ', ' ']
    ];
    
    for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 3; c++) {
            let tile = document.getElementById(r.toString() + '-' + c.toString());
            tile.innerText = ''; 
            tile.classList.remove('winner');
        }
    }
    
    gameOver = false;
    isDraw = true;
    currentPlayer = playerO;
}

const announceWinner = (winner) => {
    setTimeout(() => {
        alert(`Player ${winner} is winner!`);
    }, 100);
}
