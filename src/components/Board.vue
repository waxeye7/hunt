<script setup>
import StartGameButtonComponent from "./StartGameButton.vue";
import TimerComponent from "./Timer.vue";
import InputX from "./Xinput.vue";
import InputY from "./Yinput.vue";
</script>

<template>
    <!-- {{ survivor.trail }} -->
     <!-- HUNTER: {{ hunter.pos }}, SURVIVOR {{ survivor.pos }} -->
<div class="flex flex-col align-center">
    <div class="flex">

    <StartGameButtonComponent @click="startGame"/>
    <TimerComponent :timer="timeUntilLose" />
    <InputX @inputted="updateBoardCols" />
    <InputY @inputted="updateBoardRows" />
   
    <!-- <input type=""></input> -->
    
    </div>
    <div class="board">
        <div v-for="(row, rowIdx) in boardObjs" :key="rowIdx" class="row">
            <div 
                v-for="(col, colIdx) in row" 
                :key="colIdx" 
                :class="[
                    'col', 
                    squareClasses(colIdx, rowIdx),
                ]" 
                @click="handleUserClicked(colIdx, rowIdx)"
            >
                {{ `${col.pos.x}, ${col.pos.y}` }}
            </div>
        </div>
    </div>
</div>
</template>


<script>
export default  {
    data() {
        return {
            boardCols: 3,
            boardRows: 3,
            minBoardSize : 5,
            boardObjs: [],
            running:false,
            maxTrailLength: 3,
            hunter:{
                pos:{}
            },
            survivor:{
                pos:{
                    x: 0,
                    y: 0,
                },
                trail: []
            },
            timeUntilLose:15
        }
    },
    computed: {
        boardSize() {
            // this.boardCols = 9;
            return this.boardCols * this.boardRows;
        },
    },
    methods:{
        preGameReset() {
            this.boardObjs = [];
            let boardList = [...Array(this.boardRows)].map(() => Array(this.boardCols));
            let rowNum = 0;
            for(let row of boardList) {
                let colNum = 0;
                let rowList = [];
                for(let squareInRow of row) {
                    rowList.push(this.createSquareObject(colNum, rowNum));
                    colNum += 1;
                }
                rowNum += 1;
                this.boardObjs.push(rowList)
            }
            console.log(this.boardObjs);
            this.timeUntilLose = 100;
            this.timer = this.timeUntilLose;
            this.running = true;

            this.survivor.pos.x = Math.floor(Math.random() * this.boardCols);
            this.survivor.pos.y = Math.floor(Math.random() * this.boardRows);

            while(this.survivor.pos.x == 0 && this.survivor.pos.y == 0 || 
                this.survivor.pos.x == 0 && this.survivor.pos.y == 1 ||
                this.survivor.pos.x == 1 && this.survivor.pos.y == 0 || 
                this.survivor.pos.x == 1 && this.survivor.pos.y == 1) {

                this.survivor.pos.x = Math.floor(Math.random() * this.boardCols);
                this.survivor.pos.y = Math.floor(Math.random() * this.boardRows);
            }
            
            this.boardObjs[0][0].has_hunter = true;
            this.hunter.pos = {x:0, y:0};
        },
        createSquareObject(x, y) {
            let randomNum = Math.floor(Math.random() * 5);
            let active;
            if(randomNum == 0 && (x !== 0 || y !== 0) && (x !== 1 || y !== 1) && (x !== 2 || y !== 2)) {
                active = false;
            }
            else {
                active = true;
            }

            let square = {
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
                    square.has_hunter = false;
                    square.has_survivor = false;
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

                    console.log(this.boardObjs)


                    this.timePassesUpdateSquareObjects();
                    survivorSquare.survivor_trail.strength = 3;

                    this.preRoundCalculations();

                    clickedSquare.has_hunter = true;
                    this.hunter.pos = {x:x, y:y};

                    this.timeUntilLose -= 1;

                    if (this.isSuccess(x, y) || this.timeUntilLose === 0) {
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
                    // }
                }
                if (this.survivor.pos.x < this.boardCols -1) {
                    // let squareInQuestion = this.boardObjs[this.survivor.pos.y][this.survivor.pos.x+1];
                    // if(squareInQuestion.terrain.active) {
                        xMoves.push(1);
                    // }
                }
                const xDirection = Math.floor(Math.random() * xMoves.length);
                let newX = this.survivor.pos.x + xMoves[xDirection];

                const yMoves = [0];
                if (this.survivor.pos.y !== 0) {
                    // let squareInQuestion = this.boardObjs[this.survivor.pos.y-1][this.survivor.pos.x];
                    // if(squareInQuestion.terrain.active) {
                        yMoves.push(-1);
                    // }
                }
                if (this.survivor.pos.y < this.boardRows -1) {
                    // let squareInQuestion = this.boardObjs[this.survivor.pos.y+1][this.survivor.pos.x];
                    // if(squareInQuestion.terrain.active) {
                        yMoves.push(1);
                    // }
                }
                const yDirection = Math.floor(Math.random() * yMoves.length);
                let newY = this.survivor.pos.y + yMoves[yDirection];

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
        }
    },
    
    created() {

    }
}
</script>



<style scoped>
.flex { display:flex; }
.flex-col { flex-direction:column; }
.justify-center { justify-content:center; }
.align-center { align-items:center; }
.board {
    padding: 48px;
    background-color:rgb(88, 88, 88);
}
.row {
    display: flex;
}

.col {
    background-color: gray;
    color:white;
    font-size:30px;
    margin: 2px;
    height: 60px;
    width: 60px;
}

.allowed {
    cursor: pointer;
}

.not-allowed {
    cursor: not-allowed;
}
.inactive-square {
    background-color:rgb(88, 88, 88);
    cursor:default;
    visibility: hidden;
}
.active {
    background-color: red !important;
    cursor: default !important;
}


.success {
    background-color: green !important;
}

.survivor-near {
    background-color: #fa7502 !important;
}

.trail-1 {
    background-color: #fff0e3 !important;
}

.trail-2 {
    background-color: #facfaa !important;
}

.trail-3 {
    background-color: #fa9f50 !important;
}
</style>


