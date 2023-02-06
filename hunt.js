const boardSize = 16;
const boardWidth = Math.sqrt(boardSize);
const minBoardSize = 9;

let parent = document.getElementById("parent");
let children = parent.children;

let Game = {
    running:false,
    hunter:{

    },
    survivor:{
        pos:{}
    },
};

buildBoard();


function buildBoard() {
    let stringOfGridTemplateColumns = "";
    for(let i = 0; i < boardWidth; i++) {
        stringOfGridTemplateColumns += "140px ";
    }
    parent.style.gridTemplateColumns = stringOfGridTemplateColumns;
    
    let start_button = document.getElementById("start-game-button");
    start_button.onclick = function () {
        if(boardSize >= minBoardSize) {
            Game.running = true;
            Game.survivor.pos = {};
            localStorage.setItem("lastHuntLocation", (0 + "," + 0));
            addCursorPointer();
            handleUserClicked(children[0], 0, 0);
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


function handleUserClicked(child, x, y) {
    
    let isValidHuntLocation = checkIsValidHuntLocation(x, y);

    if(Game.running && isValidHuntLocation) {

        preRoundCalculations();

        let didYouHit = checkIfHit(x, y);
        let isHunterNearby = checkIfNearby(x, y);
    
        changeStylings(child, didYouHit, isHunterNearby);

        localStorage.setItem("lastHuntLocation", (x + "," + y));
        
    }

}

function checkIfHit(x, y) {
    if(x == Game.survivor.pos.x && y == Game.survivor.pos.y) {
        Game.running = false;
        removeCursorPointer();
        return true;
    }
    else {
        return false;
    }
}

function checkIfNearby(x, y) {
    if((x == Game.survivor.pos.x || x-1 == Game.survivor.pos.x || x+1 == Game.survivor.pos.x) && 
       (y == Game.survivor.pos.y || y-1 == Game.survivor.pos.y || y+1 == Game.survivor.pos.y)) {
        return true
    }
    else {
        return false;
    }
}

function checkIsValidHuntLocation(x, y) {
    let lastHuntLocation = localStorage.getItem("lastHuntLocation");
    let lastHuntLocationX = parseInt(lastHuntLocation[0]);
    let lastHuntLocationY = parseInt(lastHuntLocation[2]);
    if((x == lastHuntLocationX || x-1 == lastHuntLocationX || x+1 == lastHuntLocationX) &&
       (y == lastHuntLocationY || y-1 == lastHuntLocationY || y+1 == lastHuntLocationY)) {
        return true;
    }
    return false;
}

function preRoundCalculations() {
    if(!Game.survivor.pos.x && !Game.survivor.pos.y) {

        Game.survivor.pos.x = Math.floor(Math.random() * Math.sqrt(boardSize));
        Game.survivor.pos.y = Math.floor(Math.random() * Math.sqrt(boardSize));

        while(Game.survivor.pos.x == 0 && Game.survivor.pos.y == 0 || 
              Game.survivor.pos.x == 0 && Game.survivor.pos.y == 1 ||
              Game.survivor.pos.x == 1 && Game.survivor.pos.y == 0 || 
              Game.survivor.pos.x == 1 && Game.survivor.pos.y == 1) {

            Game.survivor.pos.x = Math.floor(Math.random() * Math.sqrt(boardSize));
            Game.survivor.pos.y = Math.floor(Math.random() * Math.sqrt(boardSize));
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
        child.classList.add("pointer");
    }
}
function removeCursorPointer() {
    for(let child of children) {
        child.classList.remove("pointer");
    }
}