<script setup>
import StartGameButtonComponent from "./StartGameButton.vue";
import TimerComponent from "./Timer.vue";
import InputX from "./Xinput.vue";
import InputY from "./Yinput.vue";
import Stats from "./Stats.vue";

defineProps({
  timesWon: { //'Heading_Msg' is the variable name we to it in this example, and you can name it however you want
    type: Number, // String, Number, Array, Object, Boolean
    required: true
  }
});
</script>

<template>
     <!-- HUNTER: {{ hunter.pos }}, SURVIVOR {{ survivor.pos }} -->

    <div class="flex flex-col align-center justify-center the-height container">
        <div class="flex lower-res-screen">

            <div class="flex">
                <StartGameButtonComponent @click="startGame(); changeColSize();"/>
                <TimerComponent :timer="timeUntilLose" />
            </div>
            <div class="flex">
                <InputX @inputted="updateBoardCols" />
                <InputY @inputted="updateBoardRows" />
            </div>


        </div>




        <div class="board relative">
            <div v-if="victory" class="victory-popup">
                <h1 class="vertical-center">Victory</h1>
            </div>

            <div  v-for="(row, rowIdx) in boardObjs" :key="rowIdx" class="row">
                <div 
                    v-for="(col, colIdx) in row" 
                    :key="colIdx" 
                    :class="[
                        'col', 
                        squareClasses(col.pos.x, col.pos.y),
                    ]" 
                    @click="handleUserClicked(col.pos.x, col.pos.y)"
                >
                    {{ `${col.pos.x}, ${col.pos.y}` }}
                </div>
            </div>
        </div>

        <div>
            <Stats :timesWon="timesWon" />
        </div>
    </div>
</template>


<script>
export default  {
    data() {
        return {
            colSize: window.innerWidth/22 + "px",
            totalVisited: new Set(),
            boardCols: 5,
            boardRows: 5,
            minBoardSize : 8,
            boardObjs: [],
            waterBoardPositions: [],
            running:false,
            victory:false,
            maxTrailLength: 3,
            hunter:{
                pos:{
                    x:0,
                    y:0,
                }
            },
            survivor:{
                pos:{
                    x: 0,
                    y: 0,
                },
                trail: []
            },
            timeUntilLose:15,
        }
    },
    computed: {
        boardSize() {
            return this.boardCols * this.boardRows;
        },
    },
    methods:{
        preGameReset() {
            this.boardObjs = [];
            this.waterBoardPositions = [];
            let boardList = [...Array(this.boardRows)].map(() => Array(this.boardCols));
            let rowNum = 0;
            let squareNumber = 1;
            for(let row of boardList) {
                let colNum = 0;
                let rowList = [];
                let waterRowList = [];
                for(let squareInRow of row) {

                    rowList.push(this.createSquareObject(colNum, rowNum, squareNumber));


                    if(colNum == 0 && rowNum == 0) {
                        waterRowList.push({
                            pos:{
                                x:colNum,
                                y:rowNum
                            },
                            water:false,
                            id:2
                        });
                    }
                    else {
                        waterRowList.push(
                        {
                            pos:{
                                x:colNum,
                                y:rowNum
                            },

                            water:true,
                            id:0
                        });
                    }


                    colNum += 1;
                    squareNumber += 1;
                }
                rowNum += 1;
                this.boardObjs.push(rowList);
                this.waterBoardPositions.push(waterRowList);
            }
            // console.log(this.boardObjs);

            this.createPassableTiles();

            this.timeUntilLose = 100;
            this.timer = this.timeUntilLose;
            this.victory = false;
            this.running = true;

            this.survivor.pos.x = Math.floor(Math.random() * this.boardCols);
            this.survivor.pos.y = Math.floor(Math.random() * this.boardRows);

            while(this.survivor.pos.x == 0 && this.survivor.pos.y == 0 || 
                !this.boardObjs[this.survivor.pos.y][this.survivor.pos.x].terrain.active) {

                this.survivor.pos.x = Math.floor(Math.random() * this.boardCols);
                this.survivor.pos.y = Math.floor(Math.random() * this.boardRows);
            }

            this.boardObjs[this.survivor.pos.y][this.survivor.pos.x].has_survivor = true;
            this.boardObjs[0][0].has_hunter = true;
            this.hunter.pos = {x:0, y:0};
        },
        createPassableTiles() {
            let more_tiles = true;
            let currentNumber = 2;
            let squaresChangedOnFirstRound = Infinity;
            while(more_tiles) {
                more_tiles = false;

                let rowNum = 0;
                for(let row of this.waterBoardPositions) {
                    let colNum = 0;
                    for(let col of row) {
                        let square = row[colNum];
                        if(row[colNum].id==currentNumber) {
                            let neighbours = this.findAdjacentTiles(square, this.waterBoardPositions);
                            let squaresChanged = 0;
                            for(let n of neighbours) {
                                let random;
                                if(currentNumber <= 4) {
                                    random = Math.floor(Math.random() * 5);
                                    if(random == 0 || random == 1 || random == 2 || random == 3) {
                                        if(n.id == 0) {
                                            squaresChanged ++;
                                            n.water = false;
                                            n.id = currentNumber + 1;
                                            more_tiles = true;
                                        }
                                    }
                                    else if(random == 4) {
                                        if(n.id == 0) {
                                            n.id = 1;
                                        }
                                    }
                                }
                                else {
                                    random = Math.floor(Math.random() * 8);
                                    if(random == 0 || random == 1 || random == 2 || random == 3) {
                                        if(n.id == 0) {
                                            squaresChanged ++;
                                            n.water = false;
                                            n.id = currentNumber + 1;
                                            more_tiles = true;
                                        }
                                    }
                                    else if(random == 4 || random == 5 || random == 6 || random == 7) {
                                        if(n.id == 0) {
                                            n.id = 1;
                                        }
                                    }
                                }
                                

                            }
                            if(currentNumber == 2 && squaresChanged == 0) {
                                let random = Math.floor(Math.random() * 3);
                                let chosen = neighbours[random];
                                chosen.water = false;
                                chosen.id = 3;
                                more_tiles = true;
                                squaresChangedOnFirstRound = 0;
                            }

                            if(currentNumber == 3 && squaresChanged == 0 && squaresChangedOnFirstRound == 0) {
                                let random = Math.floor(Math.random() * 5);
                                let chosen = neighbours[random];
                                chosen.water = false;
                                chosen.id = 4;

                                let random2 = Math.floor(Math.random() * 5);
                                let chosen2 = neighbours[random2];
                                chosen2.water = false;
                                chosen2.id = 4;


                                let random3 = Math.floor(Math.random() * 5);
                                let chosen3 = neighbours[random3];
                                chosen3.water = false;
                                chosen3.id = 4;

                                let random4 = Math.floor(Math.random() * 5);
                                let chosen4 = neighbours[random4];
                                chosen4.water = false;
                                chosen4.id = 4;

                                more_tiles = true;
                            }
                        }
                        colNum++;
                    }
                    rowNum++;

                }
                currentNumber ++;
            }

            let rowNum = 0;
            for(let row of this.boardObjs) {
                let colNum = 0;
                for(let col of row) {
                    if(this.waterBoardPositions[rowNum][colNum].water) {
                        col.terrain.active = false;
                    }
                    colNum++;
                }
                rowNum++;
            }
        },
        findAdjacentTiles(currentLocation, listOfObjects) {
            let neighbours = [];
            if(currentLocation && currentLocation.pos) {
                for(let i = -1; i <= 1; i++) {
                    for(let o = -1; o <= 1; o++) {
                        let x = i + currentLocation.pos.x;
                        let y = o + currentLocation.pos.y;
                        if(x >= 0 && y >= 0 && this.boardRows-1 >= y && this.boardCols-1 >= x && (x !== currentLocation.pos.x || y !== currentLocation.pos.y)) {
                            if(listOfObjects[y][x]) {
                                neighbours.push(listOfObjects[y][x])
                            }
                        }
                    }
                }
            }

            return neighbours;
        },
        createSquareObject(x, y, squareNumber) {
            let active;
            if(x !== 0 || y !== 0) {
                active = true;
            }
            else {
                active = true;
            }

            let square = {
                id:squareNumber,
                pos:{
                    x:x,
                    y:y
                },
                survivor_trail:{
                    strength:0,
                    show:true,
                },
                terrain:{
                    active:active,
                    passable:true,
                },
                has_hunter:false,
                has_survivor:false,
            };
            return square;
        },
        timePassesUpdateSquareObjects() {
            for(let row of this.boardObjs) {
                for(let square of row) {
                    if(square.survivor_trail.strength > 0) {
                        square.survivor_trail.strength -= 1;
                    }
                    if(this.hunter.pos.x !== square.pos.x || this.hunter.pos.y !== square.pos.y) {
                        square.has_hunter = false;
                    }
                    if(this.survivor.pos.x !== square.pos.x || this.survivor.pos.y !== square.pos.y) {
                        square.has_survivor = false;
                    }
                    
                }
            }
        },
        startGame() {
            if (this.boardSize >= this.minBoardSize) {
                this.preGameReset();
            }
        },
        handleUserClicked(x, y) {
            let clickedSquare = this.boardObjs[y][x];
            if(clickedSquare.terrain.active && !clickedSquare.has_hunter) {
                let survivorSquare = this.boardObjs[this.survivor.pos.y][this.survivor.pos.x];

                let isValidHuntLocation = this.checkIfNearbyToHunter(x, y);

                if (this.running && isValidHuntLocation && this.timeUntilLose > 0) {

                    // console.log(this.boardObjs)

                    this.preRoundCalculations();

                    this.hunter.pos = {x:x, y:y};
                    clickedSquare.has_hunter = true;

                    this.timePassesUpdateSquareObjects();
                    survivorSquare.survivor_trail.strength = 3;
                    
                    this.timeUntilLose -= 1;

                    if (this.isSuccess(x, y) || this.timeUntilLose === 0) {
                        let timesWon = this.timesWon;
                        timesWon ++;
                        this.$emit('updateTimesWon', timesWon)
                        this.victory = true;
                        this.running = false;
                    }
                }
            }


        },
        checkIfHit(x, y) {
            if(x == this.survivor.pos.x && y == this.survivor.pos.y) {
                this.running = false;
                return true;
            }
            else {
                return false;
            }
        },
        checkIfNearbyToSurvivor(x, y) {
            if((x == this.survivor.pos.x || x-1 == this.survivor.pos.x || x+1 == this.survivor.pos.x) && 
            (y == this.survivor.pos.y || y-1 == this.survivor.pos.y || y+1 == this.survivor.pos.y)) {
                return true
            }
            else {
                return false;
            }
        },
        checkIfNearbyToHunter(x, y) {
            if((x == this.hunter.pos.x || x-1 == this.hunter.pos.x || x+1 == this.hunter.pos.x) && 
            (y == this.hunter.pos.y || y-1 == this.hunter.pos.y || y+1 == this.hunter.pos.y)) {
                return true
            }
            else {
                return false;
            }
        },
        checkIfRangeXToHunter(x, y, range) {
            let hunterX = this.hunter.pos.x;
            let hunterY = this.hunter.pos.y;
            if(Math.abs(hunterX - x) <= range && Math.abs(hunterY - y) <= range) {
                return true
            }
            else {
                return false;
            }
        },
        preRoundCalculations() {
            let allow = false;

            while(!allow) {
                const xMoves = [0];
                if (this.survivor.pos.x !== 0) {
                    // let squareInQuestion = this.boardObjs[this.survivor.pos.y][this.survivor.pos.x-1];
                    // if(squareInQuestion.terrain.active) {
                        xMoves.push(-1);
                        if(this.hunter.pos.x === this.survivor.pos.x + 1) {
                            xMoves.push(-1,-1,-1);
                        }
                        else if(this.hunter.pos.x === this.survivor.pos.x + 2) {
                            xMoves.push(-1,-1);
                        }
                    // }
                }
                if (this.survivor.pos.x < this.boardCols -1) {
                    // let squareInQuestion = this.boardObjs[this.survivor.pos.y][this.survivor.pos.x+1];
                    // if(squareInQuestion.terrain.active) {
                        xMoves.push(1);
                        if(this.hunter.pos.x === this.survivor.pos.x - 1) {
                            xMoves.push(1,1,1);
                        }
                        else if(this.hunter.pos.x === this.survivor.pos.x - 2) {
                            xMoves.push(1,1);
                        }

                    // }
                }
                const xDirection = Math.floor(Math.random() * xMoves.length);
                let newX = this.survivor.pos.x + xMoves[xDirection];

                const yMoves = [0];
                if (this.survivor.pos.y !== 0) {
                    // let squareInQuestion = this.boardObjs[this.survivor.pos.y-1][this.survivor.pos.x];
                    // if(squareInQuestion.terrain.active) {
                        yMoves.push(-1);
                        if(this.hunter.pos.y === this.survivor.pos.y + 1) {
                            yMoves.push(-1,-1,-1);
                        }
                        else if(this.hunter.pos.y === this.survivor.pos.y + 2) {
                            yMoves.push(-1,-1);
                        }
                    // }
                }
                if (this.survivor.pos.y < this.boardRows -1) {
                    // let squareInQuestion = this.boardObjs[this.survivor.pos.y+1][this.survivor.pos.x];
                    // if(squareInQuestion.terrain.active) {
                        yMoves.push(1);

                        if(this.hunter.pos.y === this.survivor.pos.y - 1) {
                            yMoves.push(1,1,1);
                        }
                        else if(this.hunter.pos.y === this.survivor.pos.y - 2) {
                            yMoves.push(1,1);
                        }
                    // }
                }
                const yDirection = Math.floor(Math.random() * yMoves.length);
                let newY = this.survivor.pos.y + yMoves[yDirection];

                // console.log(xMoves, yMoves)

                let squareToGo = this.boardObjs[newY][newX]
                if(!squareToGo.has_hunter && squareToGo.terrain.active) {
                    allow = true;
                    this.survivor.pos.x = newX;
                    this.survivor.pos.y = newY;
                    squareToGo.has_survivor = true;
                }
            }

        },
        isActive(x, y) {
            return this.hunter.pos.x === x && this.hunter.pos.y === y;
        },
        isSuccess(x, y) {
            return this.hunter.pos.x === this.survivor.pos.x && this.hunter.pos.y === this.survivor.pos.y && this.hunter.pos.x === x && this.hunter.pos.y === y;
        },
        survivorNear(x, y) {
            return this.survivor.pos.x === x && this.survivor.pos.y === y && this.checkIfNearbyToHunter(x, y);
        },
        survivorRangeX(x, y, range) {
            let square = this.boardObjs[y][x];
          if(square.has_survivor && this.checkIfRangeXToHunter(x, y, range)) {
            return true;
          }
          else {
            return false;
          }
        },
        trailClass(x, y, square) {
            if(square.survivor_trail.strength > 0 && square.survivor_trail.show && this.checkIfRangeXToHunter(x, y, 2)) {
                return `trail-${square.survivor_trail.strength}`
            }
        },
        squareClasses(x, y) {
            const classes = [];

            let square = this.boardObjs[y][x];

            if(this.victory) {
                classes.push("lower-brightness")
            }

            if(!square.terrain.active) {
                classes.push('inactive-square');
                return classes;
            }
            
            classes.push(this.checkIfNearbyToHunter(x, y) && this.running ? 'allowed' : 'not-allowed');

            if (this.isSuccess(x, y)) {
                classes.push('success')
                return classes;
            }

            if (this.isActive(x, y)) {
                classes.push('active');
                return classes;
            }

            if (this.survivorRangeX(x, y, 2)) {
                classes.push('survivor-near');
                return classes;
            }

            classes.push(this.trailClass(x, y, square));
            return classes;
        },
        updateBoardCols(value) {
            this.boardCols = value
        },
        updateBoardRows(value) {
            this.boardRows = value
        },
        changeColSize() {
            if(this.boardCols >= this.boardRows) {
                this.colSize = window.innerWidth/(this.boardCols+17) + "px";
               
            }
            else {
                this.colSize = window.innerWidth/(this.boardRows+17) + "px";
            }
        }
    },
    
    created() {
        this.startGame()
    }
}
</script>



<style scoped>
.flex { display:flex; }
.flex-col { flex-direction:column; }
.the-height { height:calc(100vh - 46px) }
.victory-popup {
    position:absolute;
    color:rgb(255, 255, 255);
    top:50%;
    left:50%;
    transform: translate(-50%, -50%);
    max-width:246px;
    min-height:82px;
    z-index: 10;
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    font-size:30px;
}
.lower-brightness {
    filter: brightness(0.3);
}
.board {
    padding:48px;
    background-color:rgb(88, 88, 88);
}
.row {
    display: flex;
}
.col {
    background-color: rgb(105, 105, 105);
    color:white;
    font-size:20px;
    margin: 1px;
    height: v-bind(colSize);
    width: v-bind(colSize);
}
.allowed {
    cursor: pointer;
}
.allowed:hover {
    border-radius:2px;
    outline:2px white solid;
}
.not-allowed {
    cursor: not-allowed;
}
.inactive-square {
    background-color:rgb(10, 26, 255) !important;
    color:rgb(10, 26, 255);
    cursor:default;
    background-image: url("../assets/water.jpg") !important;
    background-size:cover;
    background-repeat: no-repeat;
    background-position:center;
    /* visibility: hidden; */
}
.active {
    background-image: url("../assets/hunt.webp") !important;
    background-size:70px 70px;
    background-position:center;
    background-repeat: no-repeat;
    cursor: default !important;
}
.active:hover {
    outline:none !important;
    background-color:rgb(105, 105, 105) !important; 
}
.success {
    background-image: url("../assets/won.png") !important;
    background-size:40px 40px;
    background-position:center;
    background-repeat: no-repeat;
    background-color:#358223 !important;
}
.survivor-near {
    background-image: url("../assets/survivor.gif") !important;
    background-size:70px 70px;
    background-position:center;
    background-repeat: no-repeat;
}
.trail-1 {
    background-image: url("../assets/cheese.png") !important;
    background-size:30px 30px;
    background-position:center;
    background-repeat: no-repeat;
}
.trail-2 {
    background-image: url("../assets/cheese.png") !important;
    background-size:40px 40px;
    background-position:center;
    background-repeat: no-repeat;
}
.trail-3 {
    background-image: url("../assets/cheese.png") !important;
    background-size:50px 50px;
    background-position:center;
    background-repeat: no-repeat;
}

@media only screen and (max-width: 600px) {
    .col {
        font-size:12px;
        margin: 1px;
        height: 40px;
        width: 40px;
    }
    .active {
        background-size:40px 40px;
    }
    .survivor-near {
        background-size: 40px 40px;
    }
    .lower-res-screen {
        flex-direction:column;
    }
}
</style>


