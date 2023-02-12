<script setup>
import StartGameButtonComponent from "./StartGameButton.vue";
import TimerComponent from "./Timer.vue";
</script>

<template>
    <!-- {{ survivor.trail }} -->
     <!-- HUNTER: {{ hunter.pos }}, SURVIVOR {{ survivor.pos }} -->
<div class="flex flex-col align-center">
    <div class="flex">

    <StartGameButtonComponent @click="startGame"/>
    <TimerComponent :timer="timeUntilLose" />
   
    
    </div>
    <div class="board">
        <div v-for="(row, rowIdx) in boardList" :key="rowIdx" class="row">
            <div 
                v-for="(col, colIdx) in row" 
                :key="colIdx" 
                :class="[
                    'col', 
                    squareClasses(colIdx, rowIdx),
                ]" 
                @click="handleUserClicked(colIdx, rowIdx)"
            >
                {{ `${colIdx}, ${rowIdx}` }}
            </div>
        </div>
    </div>
</div>
</template>


<script>
export default  {
    data() {
        return{
            boardCols: 7,
            boardRows: 6,
            minBoardSize : 9,
            boardList: [],
            childrenIDs: [],
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
            timeUntilLose: 0
        }
    },
    computed: {
        boardSize() {
            return this.boardCols * this.boardRows;
        },
    },
    methods:{
        preGameReset() {
            this.timeUntilLose = 15;
            this.survivor.trail = []
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
            
            this.hunter.pos = {x:0, y:0};
        },
        startGame() {
            if (this.boardSize >= this.minBoardSize) {
                this.preGameReset();
            }
        },
        handleUserClicked(x, y) {
            let isValidHuntLocation = this.checkIfNearbyToHunter(x, y);

            if (this.running && isValidHuntLocation && this.timeUntilLose > 0) {
                if (this.survivor.trail.length > this.maxTrailLength - 1) {
                    this.survivor.trail.shift();
                }
                this.survivor.trail.push(`${this.survivor.pos.x},${this.survivor.pos.y}`);

                this.preRoundCalculations();

                this.hunter.pos = {x:x, y:y};

                this.timeUntilLose -= 1;

                if (this.isSuccess(x, y) || this.timeUntilLose === 0) {
                    this.running = false;
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
        preRoundCalculations() {
            const xMoves = [0];
            if (this.survivor.pos.x !== 0) {
                xMoves.push(-1);
            }
            if (this.survivor.pos.x < this.boardCols -1) {
                xMoves.push(1);
            }
            const xDirection = Math.floor(Math.random() * xMoves.length);
            this.survivor.pos.x += xMoves[xDirection];

            const yMoves = [0];
            if (this.survivor.pos.y !== 0) {
                yMoves.push(-1);
            }
            if (this.survivor.pos.y < this.boardRows -1) {
                yMoves.push(1);
            }
            const yDirection = Math.floor(Math.random() * yMoves.length);
            this.survivor.pos.y += yMoves[yDirection];
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
        trailClass(x, y) {
            if (this.survivor.trail.includes(`${x},${y}`) && this.checkIfNearbyToHunter(x, y)) {
                return `trail-${this.survivor.trail.indexOf(`${x},${y}`)}`
            }
        },
        squareClasses(x, y) {
            const classes = [];
            classes.push(this.checkIfNearbyToHunter(x, y) && this.running ? 'allowed' : 'not-allowed');

            if (this.isSuccess(x, y)) {
                classes.push('success')
                return classes;
            }

            if (this.isActive(x, y)) {
                classes.push('active');
                return classes;
            }

            if (this.survivorNear(x, y)) {
                classes.push('survivor-near');
                return classes;
            }

            classes.push(this.trailClass(x, y));
            return classes;
        }
    },
    
    created() {
        this.boardList = [...Array(this.boardRows)].map(() => Array(this.boardCols))
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
    height: 100px;
    width: 100px;
}

.allowed {
    cursor: pointer;
}

.not-allowed {
    cursor: not-allowed;
}

.active {
    background-color: red !important;
}

.success {
    background-color: green !important;
}

.survivor-near {
    background-color: #fa7502 !important;
}

.trail-0 {
    background-color: #fff0e3 !important;
}

.trail-1 {
    background-color: #facfaa !important;
}

.trail-2 {
    background-color: #fa9f50 !important;
}
</style>


