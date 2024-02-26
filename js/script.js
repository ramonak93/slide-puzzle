// TODO 
// change tile movement mechanism (swap row-col VS GridTemplate)
// Add Success mechanism 
// filter out unsolvable combinations  https://www.geeksforgeeks.org/check-instance-15-puzzle-solvable/
// replace timer with system timing

// box controls
const btn3 = document.getElementById("btn3");
const btn4 = document.getElementById("btn4");
const buttons = [btn3, btn4];
const minutesLabel = document.querySelector(".minutes");
const secondsLabel = document.querySelector(".seconds");
const box = document.querySelector(".box");
let timer;

// helpers and features
let isStarted = false;                              // used to trigger counter inside move()
let counter = document.querySelector(".counter");   // tracks number of puzzle moves
counter.innerText = 0; 
let puzzleDimension = 4;                            // default dimension can be changed by buttons
let tilesArray = [];                                // used to store and manipulate puzzle pieces

// buttons generate new Puzzle
for (let b of buttons) {
    b.addEventListener('click', (e) => generatePuzzles(Number(e.target.getAttribute("value"))));
}

// create layout based on puzzle dimension AND return Array of pieces
function generatePuzzles(dimension) {
    document.documentElement.style.setProperty("--puzzle-size", String(dimension));
    clearBox(box);

    // assign layout based on the chosen dimension
    // if (dimension == 3) {
    //     document.getElementById("box").style.gridTemplateAreas = '"e01 e02 e03" "e04 e05 e06" "e07 e08 e09"';
    // }
    // if (dimension == 4) {
    //     document.getElementById("box").style.gridTemplateAreas = 
    //     '"e01 e02 e03 e04" "e05 e06 e07 e08" "e09 e10 e11 e12" "e13 e14 e15 e16"';
    // }

    let pieceArr = [];
    for (let i = 0; i < (dimension * dimension - 1); i++) {
        let tile = document.createElement("div");
        tile.className = "tile";
        tile.textContent = appendZero(i+1);
        tile.addEventListener("click", (e) => moveTile(e.target, dimension));
        pieceArr.push(tile);
    }
    
    shufflePieces(pieceArr);
    

    for (let k = 0; k < pieceArr.length; k++) {
        box.appendChild(pieceArr[k]);
    }
}

// takes Array of divs and randomly assigns ID's to them
function shufflePieces(arr) {
    // create Array of IDs (String) like 'e01', 'e02', 'e03'...'e99'.
    let idArr = [];
    for (let j = 0; j < arr.length + 1; j ++) {
        idArr.push("el-" + appendZero(j+1));
    }

    // shuffle arr of div's
    arr.sort(function () {
        return 0.5 - Math.random();
    })

    // adding empty tile to the end of Array
    let emptyTile = document.createElement("div");
    emptyTile.className = "tile";
    arr.push(emptyTile);

    // assign ID's to div's
    arr.forEach(function (div, index) {
        div.id = idArr[index];
    })

    
}

// move tile if possible
function moveTile(tile, dimension) {
    // if (findDirection(tile, dimension) != null) {         // check if adjacent free slot exists
    //     tile.id = findDirection(tile, dimension);          // move element to adjacent free slot
    //     counter.innerText++;
    //     if (isStarted == false) {
    //         isStarted = true;
    //         startTimer();
    //     }
    // }

    if (findDirection(tile, dimension) != null) {
        tile.id = findDirection(tile, dimension);
    }

    if (isSolved()) {
        // do smth
    }

}

// returns string ID of available adjacent slot (if it exists) or null (if it doesn't exist)
function findDirection(tile, dimension) {
    let emptyTile = box.querySelector(".tile:empty");
    let tileId = Number(tile.id.slice(-2));
    let right = document.getElementById("el-" + appendZero(tileId + 1));
    let left = document.getElementById("el-" + appendZero(tileId - 1));
    let up = document.getElementById("el-" + appendZero(tileId - dimension));
    let down = document.getElementById("el-" + appendZero(tileId + dimension));
    
    if (right === emptyTile && tileId % dimension != 0) {
        return emptyTile.id;
    }

    if (left == null && (tileId - 1) % dimension !=0) {
        return String("el-" + appendZero(tileId - 1));
    }

    if (up == null && tileId > dimension) {
        return String("el-" + appendZero(tileId - dimension));
    }

    if (down == null && tileId <= dimension * (dimension - 1)) {
        return String("el-" + appendZero(tileId + dimension));
    }
    
    return null;
}

// updates count up timer
function startTimer() {
    timer = setInterval(() => {
        timer++;
        updateTimer();        
    }, 1000)
}

function updateTimer() {
    secondsLabel.innerText = appendZero(parseInt(timer % 1000));
    minutesLabel.innerText = appendZero(parseInt(timer / 60)); 
}

// used for string formatting so that all ID's have 2 digits at the end
function appendZero (int) {
    return (int).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false});
}

// clear box
// TODO
// reset timer
function clearBox (box) {
    counter.innerText = 0;
    timer = 0;
    updateTimer();
    clearInterval(timer);
    box.innerText = '';
}


// main
generatePuzzles(puzzleDimension);
