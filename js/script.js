// TODO 
// replace timer with system timing

// DOM controls
const btn3 = document.getElementById("btn3");
const btn4 = document.getElementById("btn4");
const buttons = [btn3, btn4];
const counter = document.querySelector(".counter");     // tracks number of puzzle moves
const minutesLabel = document.querySelector(".minutes");
const secondsLabel = document.querySelector(".seconds");
const box = document.querySelector(".box");

counter.innerText = 0;
let interval;
let timer = 0;                                          // represents intervals (i.e. seconds passed)
let isStarted = false;                                  // used to trigger counter inside move()
let puzzleDimension;                                    // dimension can be changed by buttons

// generate default Puzzle 4x4
generatePuzzles(4);

// buttons generate new Puzzle upon click
for (let b of buttons) {
    b.addEventListener('click', (e) => generatePuzzles(Number(e.target.getAttribute("value"))));
}

// take puzzle size (int) and append int^2-1 shuffled tiles with click-listener to Box
function generatePuzzles(dimension) {
    puzzleDimension = dimension;
    document.documentElement.style.setProperty("--puzzle-size", String(dimension));
   
    clearBox(box);
    
    let tilesArray = [];
    for (let i = 0; i < (dimension * dimension - 1); i++) {
        let tile = document.createElement("div");
        tile.className = "tile";
        tile.textContent = formatNumber(i + 1);
        tile.addEventListener("click", (e) => moveTile(e.target));
        tilesArray.push(tile);
    }
    
    shufflePieces(tilesArray);  

    for (let k = 0; k < tilesArray.length; k++) {
        box.appendChild(tilesArray[k]);
    }
}

// take array of tiles, assign random ID's and add emptyTile
function shufflePieces(arr) {
    let idArr = [];
    for (let j = 0; j < arr.length + 1; j ++) {
        idArr.push("el-" + formatNumber(j + 1));
    }

    // shuffle arr of div's until instance of Puzzle isSolvable()
    do {
        arr.sort(function () {
            return 0.5 - Math.random();
        })
    } while (isSolvable(arr) == false);

    // add empty tile to the end of Array
    let emptyTile = document.createElement("div");
    emptyTile.className = "empty-tile";
    arr.push(emptyTile);

    // assign ID's to tiles
    arr.forEach(function (div, index) {
        div.id = idArr[index];
    })  

    isSolvable(arr);
}

// Puzzle instance is only solvable if number of inversions needed is even (given empty tile is at the bottom)
// simpliefied function taken from https://www.geeksforgeeks.org/check-instance-15-puzzle-solvable/ 
function isSolvable(arr) {
    valueArray = [];
    arr.forEach((element) => valueArray.push(element.innerText));
    return (getInversionCount(valueArray) % 2 == 0);
}

// return num of inversions (NOT swaps!) needed to solve Puzzle
function getInversionCount(arr) {
    let swapCounter = 0;
    for (let i = 0; i < puzzleDimension * puzzleDimension - 1; i++) {
        for (let j = i+1; j < puzzleDimension * puzzleDimension; j++) {
            
            if (arr[j] && arr[i] && arr[i] > arr[j]) {
                swapCounter++;
            }
        }
    }
    return swapCounter;
}

// move tile if canMove()
function moveTile(tile) {
    if (canMove(tile)) {
        swap(tile);
        counter.textContent++;
        if (!isStarted) {
            isStarted = true;
            startTimer();
        }
    }

    //TODO
    // replace alert  with something more decent
    if (isSolved()) {
        timer = 0;
        clearInterval(interval);
        alert("Congratulations! You solved the puzzle!");
    }
}

// returns TRUE if emptyTile is adjacent
function canMove(tile) {
    let emptyTile = box.querySelector(".empty-tile");
    let tileId = Number(tile.id.slice(-2));

    let right = document.getElementById("el-" + formatNumber(tileId + 1));
    let left = document.getElementById("el-" + formatNumber(tileId - 1));
    let up = document.getElementById("el-" + formatNumber(tileId - puzzleDimension));
    let down = document.getElementById("el-" + formatNumber(tileId + puzzleDimension));
    
    return ((right === emptyTile && tileId % puzzleDimension != 0) 
            || (left === emptyTile && (tileId - 1) % puzzleDimension !=0) 
            || (up === emptyTile && tileId > puzzleDimension) 
            || (down === emptyTile && tileId <= puzzleDimension * (puzzleDimension - 1))
    );
}

// swap tile with emptyTile
function swap(tile) {
    const emptyTile = box.querySelector(".empty-tile");
    const newEmptyTile = document.createElement("div");
    newEmptyTile.className = "empty-tile";
    newEmptyTile.id = tile.id;
    emptyTile.parentNode.insertBefore(newEmptyTile, tile);
    tile.id = emptyTile.id;
    emptyTile.replaceWith(tile);
}

// compare tile ID and innerText, return TRUE if all match && last tile is empty
function isSolved() {
    const tiles = Array.from(box.getElementsByClassName("tile"));
    const emptyTile = box.querySelector(".empty-tile");

    return tiles.every((tile) => 
        String(tile.id) == ("el-" + tile.innerText.slice(-2))) 
        && (emptyTile.id == ("el-" + formatNumber(puzzleDimension * puzzleDimension)));
}

// update count up timer
function startTimer() {
    interval = setInterval(() => {
        timer++;
        secondsLabel.innerText = formatNumber(parseInt(timer % 1000));
        minutesLabel.innerText = formatNumber(parseInt(timer / 60));        
    }, 1000)
}

// used for string formatting so that all ID's have 2 digits at the end
function formatNumber(int) {
    return (int).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false});
}

// reset Box, timer, counter and isStarted
function clearBox(box) {
    isStarted = false;
    counter.innerText = 0;
    timer = 0;
    clearInterval(interval);
    minutesLabel.textContent = formatNumber(0);
    secondsLabel.textContent = formatNumber(0);
    box.innerText = '';
}