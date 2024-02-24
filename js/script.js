// TODO 
// Randomize puzzles at the beggining
// Add Success mechanism
//  

// box controls
let btn3 = document.getElementById("btn3");
let btn4 = document.getElementById("btn4");
let buttons = [btn3, btn4];
let box = document.querySelector(".box");

// helpers and features
let isStarted = false; // used to trigger counter inside move()
let counter = document.querySelector(".counter"); // tracks number of puzzle moves
counter.innerText = 0; 
let puzzleDimension;
 
// generate default box of 4x4
generatePuzzles(4);
let puzzlesArr = box.querySelectorAll("div");
assignPieces(puzzlesArr);
play(puzzlesArr);

for (let b of buttons) {
    b.addEventListener('click', (e) => {
        // retrieve request Dimension from User
        let elementValue = document.getElementById(e.target.id).getAttribute("value");
        let puzzleDimension = Number(elementValue);
        
        // reset timer and box content
        clearBox(box);
        generatePuzzles(puzzleDimension);
        puzzlesArr = box.querySelectorAll("div");

        assignPieces(puzzlesArr);
        play(puzzlesArr);
    })
}

// create layout based on puzzle dimension AND fill the .box with pieces
// TODO
// separate gridTemplateAreas function and make it dynamic
function generatePuzzles (dimension) {
    document.documentElement.style.setProperty("--puzzle-size", String(dimension));

    if (dimension == 3) {
        document.getElementById("box").style.gridTemplateAreas = '"e01 e02 e03" "e04 e05 e06" "e07 e08 e09"';
    }
    if (dimension == 4) {
        document.getElementById("box").style.gridTemplateAreas = 
        '"e01 e02 e03 e04" "e05 e06 e07 e08" "e09 e10 e11 e12" "e13 e14 e15 e16"';
    }

    for (let i = 0; i < (dimension * dimension) - 1; i++) {
        box.appendChild(document.createElement("div"));
    }
}

// assign Classes, ID's and InnerText to puzzles
// TODO
// must also rearrange randomly
function assignPieces(array) {
    for (let j = 0; j < array.length; j++) {
        array[j].className += "piece";
        array[j].id = "el-" + appendZero(j+1);
        array[j].innerText = array[j].id.slice(-2);
    }
}

// shuffle puzzles randomly a.k.a. Fisher-Yates algorithm
// taken from https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
function shuffle(array) {
    let currentIndex = array.length,  randomIndex;
  
    // While there remain elements to shuffle.
    while (currentIndex > 0) {
  
      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  
    return array;
  }

// add event listener to all puzzles and move if adjacent free slot exists
function play (elms) {
    let dimension = Math.sqrt(elms.length + 1);
    for (let item of elms) {
        item.addEventListener('click', (e) => {
            let element = document.getElementById(e.target.id);
            if (findDirection(element, dimension) != null) {            // check if adjacent free slot exists
                element.id = findDirection(element, dimension); // move element to adjacent free slot
                counter.innerText++;
                if (isStarted == false) {
                    isStarted = true;
                    setInterval(setTime, 1000);
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

// set timer once a puzzle is moved()
var minutesLabel = document.querySelector(".minutes");
var secondsLabel = document.querySelector(".seconds");
var totalSeconds = 0;
function setTime() {
    ++totalSeconds;
    secondsLabel.innerText = pad(totalSeconds % 60);
    minutesLabel.innerText = pad(parseInt(totalSeconds / 60));
}

function pad(val) {
    let valString = val + "";
    if (valString.length < 2) {
        return "0" + valString;
      } else {
        return valString;
      }
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
    box.innerText = '';
}