const boardSize = 16;
const boardWidth = Math.sqrt(boardSize);
const minBoardSize = 9;

let parent = document.getElementById("parent");
let children = parent.children;
let timer = document.getElementById("timer-till-lose");

let Game = {
    running:false,
    hunter:{
        pos:{}
    },
    survivor:{
        pos:{}
    },
    timeUntilLose:0
};

buildBoard();

function buildBoard() {
    let stringOfGridTemplateColumns = "";
    for(let i = 0; i < boardWidth; i++) {
        stringOfGridTemplateColumns += "74px ";
    }
    parent.style.gridTemplateColumns = stringOfGridTemplateColumns;
    
    let start_button = document.getElementById("start-game-button");
    start_button.onclick = function () {
        if(boardSize >= minBoardSize) {
            preGameReset();
        }
    }
    
    for(let i=0; i < boardSize; i++) {
        let div = document.createElement("div");
        let x = i % boardWidth;
        let y = Math.floor(i / boardWidth);
        div.innerHTML = x + "," + y;
        parent.appendChild(div);
    }
    
    
    for(let child of children) {
        child.onclick = function () {
            handleUserClicked(child, parseInt(child.innerHTML[0]), parseInt(child.innerHTML[2]));
        }
    }
}

function preGameReset() {
    Game.timeUntilLose = 11;
    timer.innerHTML = "Timer:" + Game.timeUntilLose;
    Game.running = true;
    Game.survivor.pos = {};
    Game.hunter.pos = {x:0, y:0};
    handleUserClicked(children[0], Game.hunter.pos.x, Game.hunter.pos.y);
}


function handleUserClicked(child, x, y) {
    
    let isValidHuntLocation = checkIfNearbyToHunter(x, y);

    if(Game.running && isValidHuntLocation && Game.timeUntilLose > 0) {

        preRoundCalculations();

        let didYouHit = checkIfHit(x, y);
        let isHunterNearby = checkIfNearbyToSurvivor(x, y);
    
        changeStylings(child, didYouHit, isHunterNearby);

        Game.hunter.pos = {x:x, y:y};

        Game.timeUntilLose -= 1;
        timer.innerHTML = "Timer:" + Game.timeUntilLose;
        if(Game.timeUntilLose == 0) {
            removeCursorPointer();
        }

        addCursorPointer();
        
    }
    else if(!Game.running || Game.timeUntilLose == 0) {
        removeCursorPointer();
    }

}

function checkIfHit(x, y) {
    if(x == Game.survivor.pos.x && y == Game.survivor.pos.y) {
        removeCursorPointer();
        Game.running = false;
        return true;
    }
    else {
        return false;
    }
}

function checkIfNearbyToSurvivor(x, y) {
    if((x == Game.survivor.pos.x || x-1 == Game.survivor.pos.x || x+1 == Game.survivor.pos.x) && 
       (y == Game.survivor.pos.y || y-1 == Game.survivor.pos.y || y+1 == Game.survivor.pos.y)) {
        return true
    }
    else {
        return false;
    }
}

function checkIfNearbyToHunter(x, y) {
    if((x == Game.hunter.pos.x || x-1 == Game.hunter.pos.x || x+1 == Game.hunter.pos.x) && 
       (y == Game.hunter.pos.y || y-1 == Game.hunter.pos.y || y+1 == Game.hunter.pos.y)) {
        return true
    }
    else {
        return false;
    }
}


function preRoundCalculations() {
    if(!Game.survivor.pos.x && !Game.survivor.pos.y) {

        Game.survivor.pos.x = Math.floor(Math.random() * boardWidth);
        Game.survivor.pos.y = Math.floor(Math.random() * boardWidth);

        while(Game.survivor.pos.x == 0 && Game.survivor.pos.y == 0 || 
              Game.survivor.pos.x == 0 && Game.survivor.pos.y == 1 ||
              Game.survivor.pos.x == 1 && Game.survivor.pos.y == 0 || 
              Game.survivor.pos.x == 1 && Game.survivor.pos.y == 1) {

            Game.survivor.pos.x = Math.floor(Math.random() * boardWidth);
            Game.survivor.pos.y = Math.floor(Math.random() * boardWidth);
        }


    }
    else {
        let xRandomDecider = Math.floor(Math.random() * 5);
        if(xRandomDecider == 0 || xRandomDecider == 1) {
            Game.survivor.pos.x -= 1;
            Game.survivor.pos.x = Math.abs(Game.survivor.pos.x);
        }
        else if(xRandomDecider == 3 || xRandomDecider == 4) {
            if(Game.survivor.pos.x < boardWidth-1) {
                Game.survivor.pos.x += 1;
            }
            else {
                Game.survivor.pos.x -= 1;
            }
        }

        let yRandomDecider = Math.floor(Math.random() * 5);
        if(yRandomDecider == 0 || yRandomDecider == 1) {
            Game.survivor.pos.y -= 1;
            Game.survivor.pos.y = Math.abs(Game.survivor.pos.y);
        }
        else if(yRandomDecider == 3 || yRandomDecider == 4) {
            if(Game.survivor.pos.y < boardWidth-1) {
                Game.survivor.pos.y += 1;
            }
            else {
                Game.survivor.pos.y -= 1;
            }
        }
    }
}

function changeStylings(child, didYouHit, isHunterNearby) {

    for(let child of children) {
        child.style.background = "gray";
    }
    if(didYouHit) {
        child.style.background = "green";
    }
    else {
        child.style.background = "red";

        if(isHunterNearby) {
            for(let child of children) {
                if(parseInt(child.innerHTML[0]) == Game.survivor.pos.x && parseInt(child.innerHTML[2]) == Game.survivor.pos.y) {
                    child.style.background = "orange"
                }
            }
        }

    }
    
    
}

function addCursorPointer() {
    for(let child of children) {
        if(checkIfNearbyToHunter(parseInt(child.innerHTML[0]), parseInt(child.innerHTML[2]))) {
            child.classList.add("pointer");
            child.classList.remove("not-allowed");
        }
        else {
            child.classList.add("not-allowed");
            child.classList.remove("pointer");
        }
    }
}
function removeCursorPointer() {
    for(let child of children) {
        child.classList.remove("not-allowed");
        child.classList.remove("pointer");
    }
}