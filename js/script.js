// TODO 
// change tile movement mechanism (swap row-col instead of GridTemplate)
// Add Success mechanism
// filter out unsolvable combinations 
// 

// box controls
const btn3 = document.getElementById("btn3");
const btn4 = document.getElementById("btn4");
const minutesLabel = document.querySelector(".minutes");
const secondsLabel = document.querySelector(".seconds");
const buttons = [btn3, btn4];
const box = document.querySelector(".box");
let timer;

// helpers and features
let isStarted = false; // used to trigger counter inside move()
let counter = document.querySelector(".counter"); // tracks number of puzzle moves
counter.innerText = 0; 
let puzzleDimension;
let tilesArray = []; // used to store and manipulate puzzle pieces
 
// generate default box of 4x4
document.addEventListener("DOMContentLoaded", (e) => { 
    clearBox(box);
    tilesArray = generatePuzzles(4);
    shufflePieces(tilesArray);
    for (let i = 0; i < tilesArray.length; i++) {
        box.appendChild(tilesArray[i]);
    }
    play(tilesArray);
})

// generate layout by button input
for (let b of buttons) {
    b.addEventListener('click', (e) => {
        // retrieve request Dimension from User
        const elementValue = document.getElementById(e.target.id).getAttribute("value");
        const puzzleDimension = Number(elementValue);
        clearBox(box);                                // clear timer and .box content before populatin with new content  
        tilesArray = generatePuzzles(puzzleDimension);// generate pieces and store in Array
        shufflePieces(tilesArray);                    // randomly allocate pieces (Otherwise, what's the point?)

        // append randomized pieces to .box
        for (let k = 0; k < tilesArray.length; k++) {
            box.appendChild(tilesArray[k]);
        }
        
        play(tilesArray);
    })
}

// create layout based on puzzle dimension AND return Array of pieces
function generatePuzzles(dimension) {
    document.documentElement.style.setProperty("--puzzle-size", String(dimension));

    // assign layout based on the chosen dimension
    if (dimension == 3) {
        document.getElementById("box").style.gridTemplateAreas = '"e01 e02 e03" "e04 e05 e06" "e07 e08 e09"';
    }
    if (dimension == 4) {
        document.getElementById("box").style.gridTemplateAreas = 
        '"e01 e02 e03 e04" "e05 e06 e07 e08" "e09 e10 e11 e12" "e13 e14 e15 e16"';
    }

    let pieceArr = [];
    for (let i = 0; i < (dimension * dimension - 1); i++) {
        let childDiv = document.createElement("div");
        childDiv.className = "tile";
        childDiv.innerText = appendZero(i+1);
        pieceArr.push(childDiv);
    }

    return pieceArr;
}

// takes Array of divs and returns them shuffled with ID's
function shufflePieces(arr) {
    // create Array of IDs like 'e01', 'e02', 'e03'...'e99'.
    let idArr = [];
    for (let j = 0; j < arr.length; j ++) {
        idArr.push("el-" + appendZero(j+1));
    }
    // shuffle IDs inside Array
    idArr.sort(function () {
        return 0.5 - Math.random();
    })
    // shuffle arr of div's
    arr.sort(function () {
        return 0.5 - Math.random();
    })
    // assign ID's to div's
    arr.forEach(function (div, index) {
        div.id = idArr[index];
    })
}

// add event listener to all puzzles and move if adjacent free slot exists
function play(elms) {
    let dimension = Math.sqrt(elms.length + 1);
    for (let item of elms) {
        item.addEventListener('click', (e) => {
            let element = document.getElementById(e.target.id);
            if (findDirection(element, dimension) != null) {    // check if adjacent free slot exists
                element.id = findDirection(element, dimension); // move element to adjacent free slot
                counter.innerText++;
                if (isStarted == false) {
                    isStarted = true;
                    startTimer();
                }
            }
        })
    }
}

// returns string ID of available adjacent slot (if it exists) or null (if it doesn't exist)
function findDirection(element, dimension) {
    let elementIdNum = Number(element.id.slice(-2));
    let right = document.getElementById("el-" + appendZero(elementIdNum + 1));
    let left = document.getElementById("el-" + appendZero(elementIdNum - 1));
    let up = document.getElementById("el-" + appendZero(elementIdNum - dimension));
    let down = document.getElementById("el-" + appendZero(elementIdNum + dimension));
    
    if (right == null && elementIdNum % dimension != 0) {
        return String("el-" + appendZero(elementIdNum + 1));
    }

    if (left == null && (elementIdNum - 1) % dimension !=0) {
        return String("el-" + appendZero(elementIdNum - 1));
    }

    if (up == null && elementIdNum > dimension) {
        return String("el-" + appendZero(elementIdNum - dimension));
    }

    if (down == null && elementIdNum <= dimension * (dimension - 1)) {
        return String("el-" + appendZero(elementIdNum + dimension));
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