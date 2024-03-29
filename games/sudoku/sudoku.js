let numberSelected = null;
let tileSelected = null;

let board = [];
let solotion = [];
let missed = 0;

let sudokuSet = [
    {
        board: [
            "--74916-5",
            "2---6-3-9",
            "-----7-1-",
            "-586----4",
            "--3----9-",
            "--62--187",
            "9-4-7---2",
            "67-83----",
            "81--45---"
        ],
        solution: [
            "387491625",
            "241568379",
            "569327418",
            "758619234",
            "123784596",
            "496253187",
            "934176852",
            "675832941",
            "812945763"
        ]
    },
    {
        board: [
            "---491---",
            "2-----3-9",
            "-----7-1-",
            "-58-----4",
            "---3----9",
            "--62--1--",
            "9-4-7---2",
            "67-8-----",
            "81--45---"
        ],
        solution: [
            "387491625",
            "241568379",
            "569327418",
            "758619234",
            "123784596",
            "496253187",
            "934176852",
            "675832941",
            "812945763"
        ]
    },
    {
        board: [
            "53--7----",
            "6--195---",
            "-98----6-",
            "8---6---3",
            "4--8-3--1",
            "7---2---6",
            "-6----28-",
            "---419--5",
            "----8--79"
        ],
        solution: [
            "534678912",
            "672195348",
            "198342567",
            "859761423",
            "426853791",
            "713924856",
            "961537284",
            "287419635",
            "345286179"
        ]        
    },
    {
        board: [
            "---26-7-1",
            "68--7--9-",
            "19---45--",
            "82-1---4-",
            "--46-29--",
            "-5---3-28",
            "--93---74",
            "-4--5--36",
            "7-3-18---"
        ],
        solution: [
            "435269781",
            "682571493",
            "197834562",
            "826195347",
            "374682915",
            "951743628",
            "519326874",
            "248957136",
            "763418259"
        ]        
    }, 
    {
        board: [
            "-6-3-2-8-",
            "58---97--",
            "2----1-36",
            "-9-6-5-1-",
            "3-7---6-4",
            "-4-8-3-7-",
            "91-4----5",
            "--72---46",
            "-3-1-6-9-"
        ],
        solution: [
            "167352489",
            "583419726",
            "294867135",
            "879625314",
            "327941658",
            "645183972",
            "912438567",
            "758296143",
            "436571298"
        ]        
    },
    {
        board: [
            "7--4-36-8",
            "--3-8-1--",
            "-9---7-26",
            "--2---8-7",
            "5-7---3-4",
            "6-4---5--",
            "91-6---4-",
            "--4-2-7--",
            "2-53-9--1"
        ],
        solution: [
            "751493628",
            "243681957",
            "198527436",
            "312946587",
            "567218394",
            "684735219",
            "931672845",
            "876459163",
            "425839761"
        ]        
    },
    {
        board: [
            "2-5---3-9",
            "----2-68-",
            "-7-8---1-",
            "--7--8-5-",
            "---4-2---",
            "-3-5--7--",
            "-1---9-8-",
            "-24-1----",
            "3-6---7-4"
        ],
        solution: [
            "285416379",
            "931752684",
            "476839512",
            "197648235",
            "658492173",
            "342571968",
            "513967428",
            "724183596",
            "869325741"
        ]        
    },
    {
        board: [
            "8--------",
            "--36-----",
            "-7--9-2--",
            "-5---7---",
            "----457--",
            "---1---3-",
            "--1----68",
            "--85---1-",
            "-9----4--"
        ],
        solution: [
            "812753649",
            "943682175",
            "675491283",
            "154237896",
            "369845721",
            "287169534",
            "521974368",
            "438526917",
            "796318452"
        ]        
    },
    {
        board: [
            "--5-1-9-4",
            "73----8--",
            "----45---",
            "-5-8----7",
            "---3-7---",
            "4----1-5-",
            "---71----",
            "--4----36",
            "9-3-6-5--"
        ],
        solution: [
            "265713984",
            "739246851",
            "814954627",
            "152869347",
            "986437512",
            "473128569",
            "648791235",
            "527984136",
            "391652478"
        ]        
    },
    {
        board: [
            "-1-5----3",
            "--4-2----",
            "9--3-74-1",
            "--8-4--7-",
            "3---2---8",
            "-6--9-5--",
            "2-46-1--9",
            "----7-6--",
            "4----8-2-"
        ],
        solution: [
            "617598243",
            "854127693",
            "923367451",
            "198645372",
            "375412968",
            "462839517",
            "284671539",
            "531974826",
            "749283165"
        ]        
    },
    {
        board: [
            "9--7----1",
            "-8---46--",
            "--31-8---",
            "--6-5---4",
            "---9-1---",
            "1---4-2--",
            "---4-37--",
            "--52---8-",
            "6----9--2"
        ],
        solution: [
            "945763821",
            "283514679",
            "763128495",
            "826957134",
            "574892316",
            "119346287",
            "498231756",
            "35247698",
            "617589432"
        ]        
    },
    {
        board: [
            "2------6-",
            "----59-1-",
            "--7----45",
            "-9-----3-",
            "8---6---2",
            "-3-----7-",
            "46----8--",
            "-5-21----",
            "-2------9"
        ],
        solution: [
            "293148756",
            "468759213",
            "517632845",
            "649587132",
            "851463972",
            "732914687",
            "14632589",
            "975281364",
            "328476519"
        ]        
    }
];

window.onload = function () {
    setGame();
    document.getElementById('new-game').addEventListener('click', newGame);
}

const setGame = () => {

    const randomSet = sudokuSet[Math.floor(Math.random() * sudokuSet.length)];
    board = JSON.parse(JSON.stringify(randomSet.board));
    solution = randomSet.solution;


    for (let i = 1; i <= 9; i++) {
        //<div id='1' class='number'>1</div>
        let number = document.createElement('div');
        number.id = i;
        number.innerText = i;
        number.addEventListener('click', selectNumber);
        number.classList.add('number');
        document.getElementById('digit').appendChild(number);
    }

    //board 9x9
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            let tile = document.createElement('div');
            tile.id = r.toString() + '-' + c.toString();
            tile.classList.add('tile');
            if (board[r][c] !== '-') {
                tile.innerText = board[r][c];
                tile.classList.add('tile-start');
            }

            if (r == 2 || r == 5) tile.classList.add('horizontal-line');

            if (c == 2 || c == 5) tile.classList.add('vertical-line');

            tile.addEventListener('click', selectTile);
            document.getElementById('board').appendChild(tile);
        }
    }
}

const selectNumber = (e) => {
    if (numberSelected != null) {
        numberSelected.classList.remove('number-selected');
    }
    numberSelected = e.target;
    numberSelected.classList.add('number-selected');
}

const selectTile = (e) => {
    if (numberSelected) {
        //'0-0' '0-1'... '3-1'
        let coords = e.target.id.split('-'); //[ '0', '0']
        let r = parseInt(coords[0]);
        let c = parseInt(coords[1]);

        let correctValue = solution[r][c];
        let currentValue = e.target.innerText;
        let selectedValue = numberSelected.id;

        if (currentValue !== '') {
            if (currentValue !== correctValue && selectedValue === correctValue) {
                missed = Math.max(0, missed - 1);
                e.target.classList.remove('tile-missed');
            } else if (currentValue === correctValue && selectedValue !== correctValue) {
                missed++;
                e.target.classList.add('tile-missed');
            }
        } else {
            if (selectedValue !== correctValue) {
                missed++;
                e.target.classList.add('tile-missed');
            }
        }

        e.target.innerText = selectedValue;

        let errorText = document.getElementById('error');
        errorText.innerHTML = 'Missed number: ' + missed;
        errorText.style.color = 'red';

        board[r] = board[r].slice(0, c) + numberSelected.id + board[r].slice(c + 1);
        checkWin();
    }
}

const checkWin = () => {
    let currentBoard = board.join('');
    let solutionString = solution.join('');
    if (currentBoard === solutionString) {
        let winText = document.getElementById('error');
        winText.innerHTML = 'Congratulation, Winner!!!';
        winText.style.color = 'yellow';
    }
}


const newGame = () => {
    missed = 0;
    let text = document.getElementById('error');
    text.innerHTML = 'Missed number: 0';
    text.style.color = '#000';

    const randomSet = sudokuSet[Math.floor(Math.random() * sudokuSet.length)];
    board = JSON.parse(JSON.stringify(randomSet.board));
    solution = randomSet.solution;

    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            let tileId = r.toString() + '-' + c.toString();
            let tile = document.getElementById(tileId);
            tile.innerText = board[r][c] === '-' ? '' : board[r][c];
            tile.classList.remove('tile-missed');
        }
    }

    if (numberSelected) {
        numberSelected.classList.remove('number-selected');
        numberSelected = null;
    }
}