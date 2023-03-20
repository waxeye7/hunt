<script setup lang="ts">
import 'animate.css';
import { useGameStore } from "../stores/Game";
import { mapStores } from 'pinia'
import WinApi from "../api/Win";
</script>

<template>
    <!-- HUNTER: {{ hunter.pos }}, SURVIVOR {{ survivor.pos }} -->
    <div style="color:white">{{ gameStore.hunter }}</div>
    <div style="color:white">{{ gameStore.survivor }}</div>

    <div style="color:white; position:absolute">WELCOME YOU ARE PLAYING AS AN {{ gameStore.currentPlayerType.toUpperCase()
    }}S</div>
    <div class="flex flex-col align-center justify-center the-height relative">

        <div v-if="survivorPickingPos && gameStore.currentPlayerType === 'survivor'" class="starting-location-style">pick
            your starting
            location now</div>
        <div v-else-if="survivorPickingPos && gameStore.currentPlayerType === 'hunter'" class="starting-location-style">the
            survivor is
            picking their starting location now</div>
        <div v-else-if="!running" class="starting-location-style">Game over</div>

        <div class="board relative">
            <div v-if="victory" class="victory-popup">
                <h1 class="vertical-center">Victory</h1>
            </div>

            <div v-for="(row, rowIdx) in gameStore.board" :class="{ 'marginLeftBasedOnSquareSize': rowIdx % 2 == 1 }"
                :key="rowIdx" class="row">
                <div v-for="(col, colIdx) in row" :key="colIdx" :class="[
                    'hex animate__animated animate__zoomIn',
                    squareClasses(col.pos.x, col.pos.y),
                ]" @click="handleUserClicked(col.pos.x, col.pos.y)">
                    {{ `${col.pos.x}, ${col.pos.y}` }}
                </div>
            </div>
        </div>
    </div>
</template>


<script lang="ts">
export default {
    data() {
        return {
            colSize: window.innerWidth / 25 + "px",
            survivorPickingPos: true,
            waterBoardPositions: [],
            running: true, //add running to gamestore
            victory: false,
        }
    },
    computed: {
        ...mapStores(useGameStore),
    },
    methods: {
        async bindSurvivorLocation(x, y) {
            console.log('working')
            // this.gameStore.survivor.pos = { x, y };
            await this.gameStore.updateGameByCode(this.gameStore.gameCode, { "survivor.pos": { x, y }, "survivor.has_moved": true })
            this.survivorPickingPos = false;
            await this.gameStore.getGameByCode(this.gameStore.gameCode);
            this.gameStore.survivor.has_moved = false;


            let board = this.gameStore.board;
            for (let row of board) {
                for (let square of row) {

                    if (this.gameStore.survivor.pos.x !== square.pos.x || this.gameStore.survivor.pos.y !== square.pos.y) {
                        square.has_survivor = false;
                    }
                    else if (this.gameStore.survivor.pos.x === square.pos.x && this.gameStore.survivor.pos.y === square.pos.y) {
                        square.has_survivor = true;
                    }

                }
            }
            board[this.gameStore.survivor.pos.y][this.gameStore.survivor.pos.x].survivor_trail.strength = 3;

            await this.gameStore.updateGameByCode(this.gameStore.gameCode, { "board": board });


            this.playGame();
        },

        async timePassesUpdateSquareObjects() {
            if (this.gameStore.currentPlayerType === "hunter") { //let hunter reset for both so only one call and nothing gets done twice.

                let board = this.gameStore.board;
                for (let row of board) {
                    for (let square of row) {
                        if (square.survivor_trail.strength > 0) {
                            square.survivor_trail.strength -= 1;
                        }
                        if (this.gameStore.hunter.pos.x !== square.pos.x || this.gameStore.hunter.pos.y !== square.pos.y) {
                            square.has_hunter = false;
                        }
                        else if (this.gameStore.hunter.pos.x === square.pos.x && this.gameStore.hunter.pos.y === square.pos.y) {
                            square.has_hunter = true;
                        }

                        if (this.gameStore.survivor.pos.x !== square.pos.x || this.gameStore.survivor.pos.y !== square.pos.y) {
                            square.has_survivor = false;
                        }
                        else if (this.gameStore.survivor.pos.x === square.pos.x && this.gameStore.survivor.pos.y === square.pos.y) {
                            square.has_survivor = true;
                        }

                    }
                }
                board[this.gameStore.survivor.pos.y][this.gameStore.survivor.pos.x].survivor_trail.strength = 4;

                await this.gameStore.updateGameByCode(this.gameStore.gameCode, { "board": board });

            }

        },

        async handleUserClicked(x, y) {
            let clickedSquare = this.gameStore.board[y][x];

            if (this.gameStore.currentPlayerType === "survivor") {
                if (clickedSquare.has_hunter || this.gameStore.survivor.has_moved) {
                    return;
                }

                if (this.survivorPickingPos && clickedSquare.terrain.active) {
                    await this.bindSurvivorLocation(x, y)
                }
                else if (this.running && clickedSquare.terrain.active && this.checkIfNearbyToSurvivor(x, y) && !clickedSquare.has_hunter) {

                    await this.gameStore.updateGameByCode(this.gameStore.gameCode, { "survivor.pos": { x, y }, "survivor.has_moved": true })

                }
            }
            else if (this.gameStore.currentPlayerType == "hunter") {
                if (this.survivorPickingPos || this.gameStore.hunter.has_moved) {
                    return;
                }
                if (this.running && clickedSquare.terrain.active && this.checkIfNearbyToHunter(x, y)) {

                    await this.gameStore.updateGameByCode(this.gameStore.gameCode, { "hunter.pos": { x, y }, "hunter.has_moved": true })

                }
            }
        },
        checkIfHit(x, y) {
            if (x == this.gameStore.survivor.pos.x && y == this.gameStore.survivor.pos.y) {
                this.running = false;
                return true;
            }
            else {
                return false;
            }
        },
        checkIfNearbyToSurvivor(x, y) {
            if ((x == this.gameStore.survivor.pos.x || x - 1 == this.gameStore.survivor.pos.x || x + 1 == this.gameStore.survivor.pos.x) &&
                (y == this.gameStore.survivor.pos.y || y - 1 == this.gameStore.survivor.pos.y || y + 1 == this.gameStore.survivor.pos.y)) {

                if (this.gameStore.survivor.pos.y % 2 == 0 && (this.gameStore.survivor.pos.x + 1 == x && (this.gameStore.survivor.pos.y - 1 == y || this.gameStore.survivor.pos.y + 1 == y)) ||
                    this.gameStore.survivor.pos.y % 2 == 1 && (this.gameStore.survivor.pos.x - 1 == x && (this.gameStore.survivor.pos.y - 1 == y || this.gameStore.survivor.pos.y + 1 == y))) {

                    return false;

                }


                return true
            }
            else {
                return false;
            }
        },
        checkIfNearbyToHunter(x, y) {


            if ((x == this.gameStore.hunter.pos.x || x - 1 == this.gameStore.hunter.pos.x || x + 1 == this.gameStore.hunter.pos.x) &&
                (y == this.gameStore.hunter.pos.y || y - 1 == this.gameStore.hunter.pos.y || y + 1 == this.gameStore.hunter.pos.y)) {



                if (this.gameStore.hunter.pos.y % 2 == 0 && (this.gameStore.hunter.pos.x + 1 == x && (this.gameStore.hunter.pos.y - 1 == y || this.gameStore.hunter.pos.y + 1 == y)) ||
                    this.gameStore.hunter.pos.y % 2 == 1 && (this.gameStore.hunter.pos.x - 1 == x && (this.gameStore.hunter.pos.y - 1 == y || this.gameStore.hunter.pos.y + 1 == y))) {

                    return false;

                }


                return true
            }
            else {
                return false;
            }
        },

        checkIfRangeXToHunter(x, y, range) {

            let hunterX = this.gameStore.hunter.pos.x;
            let hunterY = this.gameStore.hunter.pos.y;
            if (Math.abs(hunterX - x) <= range && Math.abs(hunterY - y) <= range) {
                if (hunterY % 2 == 0 && Math.abs(hunterX - x) == range && Math.abs(hunterY - y) >= 1 && x > hunterX ||
                    hunterY % 2 == 1 && Math.abs(hunterX - x) == range && Math.abs(hunterY - y) >= 1 && x < hunterX) {
                    return false;
                }
                return true;
            }
            else {
                return false;
            }
        },
        isActive(x, y) {
            return this.gameStore.hunter.pos.x === x && this.gameStore.hunter.pos.y === y;
        },
        isSuccess(x, y) {
            return this.gameStore.hunter.pos.x === this.gameStore.survivor.pos.x && this.gameStore.hunter.pos.y === this.gameStore.survivor.pos.y && this.gameStore.hunter.pos.x === x && this.gameStore.hunter.pos.y === y;
        },
        survivorNear(x, y) {
            return this.gameStore.survivor.pos.x === x && this.gameStore.survivor.pos.y === y && this.checkIfNearbyToHunter(x, y);
        },
        survivorRangeX(x, y, range) {
            let square = this.gameStore.board[y][x];
            if (square.has_survivor && this.checkIfRangeXToHunter(x, y, range)) {
                return true;
            }
            else {
                return false;
            }
        },
        trailClass(x, y, square) {
            if (square.survivor_trail.strength > 0 && square.survivor_trail.show && this.checkIfRangeXToHunter(x, y, 2)) {
                return `trail-${square.survivor_trail.strength}`
            }
        },
        squareClasses(x, y) {
            const classes = [];
            let square = this.gameStore.board[y][x];
            if (!this.running) {
                classes.push("lower-brightness")
            }
            if (this.gameStore.currentPlayerType === "hunter" && this.survivorPickingPos) {
                classes.push("lower-brightness", "not-allowed");
                if (square.has_hunter) {
                    classes.push('survivor-see-hunter')
                }
            }
            if (!square.terrain.active) {
                classes.push('inactive-square');
                return classes;
            }


            if (this.gameStore.currentPlayerType === "survivor") {
                if (square.has_hunter) {
                    classes.push('survivor-see-hunter');
                    return classes
                }
                if (this.running && this.survivorPickingPos) {
                    classes.push('allowed');
                    return classes;
                }
                classes.push(this.checkIfNearbyToSurvivor(x, y) && this.running ? 'allowed' : 'not-allowed');
                if (square.pos.x === this.gameStore.survivor.pos.x && square.pos.y === this.gameStore.survivor.pos.y) {
                    classes.push('i-am-survivor')
                }

            }
            else if (this.gameStore.currentPlayerType === "hunter" && !this.survivorPickingPos) {

                if (this.isActive(x, y)) {
                    classes.push('active');
                    return classes;
                }
                classes.push(this.checkIfNearbyToHunter(x, y) && this.running ? 'allowed' : 'not-allowed');
                if (this.survivorRangeX(x, y, 2)) {
                    classes.push('survivor-near');
                    return classes;
                }

            }

            classes.push(this.trailClass(x, y, square));
            return classes;
        },

        async playGame() {
            const games = await this.gameStore.getGames();
            for await (const change of games.watch({
                filter: {
                    operationType: "update",
                    "fullDocument.code": this.gameStore.gameCode,
                },
            })) {
                // The change event will always represent a newly inserted perennial
                if (change.operationType !== "update") {
                    continue;
                }
                const { fullDocument } = change;
                // const { hunter, survivor } = fullDocument;
                const survivorHasMoved = fullDocument.survivor.has_moved;
                const hunterHasMoved = fullDocument.hunter.has_moved;
                if (survivorHasMoved && hunterHasMoved) {
                    await this.resetForNewTurn()
                    console.log('both moved, resetting for next round')
                }
                if (!survivorHasMoved && !hunterHasMoved) {
                    await this.gameStore.getGameByCode(this.gameStore.gameCode);

                }
            }
        },

        async checkIfGameOver() {
            if (this.gameStore.hunter.pos.x === this.gameStore.survivor.pos.x && this.gameStore.hunter.pos.y === this.gameStore.survivor.pos.y) {
                this.running = false;
                if (this.gameStore.currentPlayerType === "hunter")
                    await WinApi.incrementWins();
            }
        },

        async resetForNewTurn() {
            await this.gameStore.getGameByCode(this.gameStore.gameCode);
            await this.timePassesUpdateHunterAndSurvivor();
            await this.timePassesUpdateSquareObjects();
            this.checkIfGameOver();
        },
        async timePassesUpdateHunterAndSurvivor() {
            if (this.gameStore.currentPlayerType === "hunter") { //let hunter update both so only make one call
                await this.gameStore.updateGameByCode(this.gameStore.gameCode, { "hunter.has_moved": false, "survivor.has_moved": false });
            }

        },

        async waitForSurvivorPosition() {
            const games = await this.gameStore.getGames();
            for await (const change of games.watch({
                filter: {
                    operationType: "update",
                    "fullDocument.code": this.gameStore.gameCode,
                },
            })) {
                // The change event will always represent a newly inserted perennial
                if (change.operationType !== "update") {
                    continue;
                }
                const { fullDocument } = change;
                if (fullDocument.survivor.has_moved && this.survivorPickingPos) {
                    console.log('survivor has moved')
                    this.survivorPickingPos = false;
                    await this.gameStore.updateGameByCode(this.gameStore.gameCode, { "survivor.has_moved": false });
                    await this.gameStore.getGameByCode(this.gameStore.gameCode);
                    break;
                }
            }
            this.playGame();
        },

    },

    async created() {
        if (this.gameStore.currentPlayerType === "hunter") {
            await this.waitForSurvivorPosition();
        }

    }
}
</script>



<style scoped>
.flex {
    display: flex;
}

.flex-col {
    flex-direction: column;
}

.the-height {
    min-height: calc(100vh - 46px)
}

.victory-popup {
    position: absolute;
    color: rgb(255, 255, 255);
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    max-width: 246px;
    min-height: 82px;
    z-index: 10;
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    font-size: 30px;
}

.lower-brightness {
    filter: brightness(0.3) !important;
}

.starting-location-style {
    color: white;
    position: absolute;
    top: 14%;
    z-index: 100;
    font-size: clamp(20px, 5vw, 30px);
}

.board {
    padding: 48px;
    background-color: rgb(88, 88, 88);
}

.row {
    display: flex;
}

.col {
    background-color: rgb(105, 105, 105);
    color: white;
    font-size: 12px;
    margin: 0px;
    height: v-bind(colSize);
    width: v-bind(colSize);
}

.marginLeftBasedOnSquareSize {
    /* margin-left:calc(v-bind(colSize)/2); */
    margin-left: 52px;
    /* margin-top:calc(v-bind(colSize)) */
}


.hex {
    /* transition:0.225s all; */
    margin-top: -26px;
    width: 100px;
    height: 100px;
    background-color: rgb(145, 145, 145);
    position: relative;
    clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);

}

.allowed {
    cursor: pointer;
}

.allowed:hover {
    background-color: rgb(167, 167, 167);
    transform: scale(1.05);
    z-index: 2;

}

.active {
    background-color: rgb(145, 145, 145) !important;
    background-image: url("../assets/hunt.webp") !important;
    background-size: 70px 70px;
    background-position: center;
    background-repeat: no-repeat;
    cursor: default !important;
    filter: brightness(1);
    transform: scale(1) !important;
}

.not-allowed {
    cursor: not-allowed !important;
}

.inactive-square {
    cursor: not-allowed !important;
    /* background-color: rgb(255, 0, 0); */
    /* clip-path: polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%); */
    background-image: url("../assets/water.jpg") !important;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
    /* visibility: hidden; */
}



.survivor-see-hunter {
    background-color: rgb(145, 145, 145) !important;
    background-image: url("../assets/hunt.webp") !important;
    background-size: 70px 70px;
    background-position: center;
    background-repeat: no-repeat;
    cursor: not-allowed !important;
    /* filter: brightness(1) !important; */
    transform: scale(1) !important;
}

.active:hover {
    outline: none !important;
    /* background-color:rgb(105, 105, 105) !important;  */
}

.success {
    background-image: url("../assets/won.png") !important;
    background-size: 40px 40px;
    background-position: center;
    background-repeat: no-repeat;
    background-color: #358223 !important;
}

.survivor-near {
    background-image: url("../assets/survivor.gif") !important;
    background-size: 70px 70px;
    background-position: center;
    background-repeat: no-repeat;
}



.i-am-survivor:hover {
    transform: scale(1) !important;
    background-color: rgb(145, 145, 145) !important;
    /* filter: none !important; */
}

.trail-1 {
    background-image: url("../assets/cheese.png") !important;
    background-size: 30px 30px;
    background-position: center;
    background-repeat: no-repeat;
}

.trail-2 {
    background-image: url("../assets/cheese.png") !important;
    background-size: 40px 40px;
    background-position: center;
    background-repeat: no-repeat;
}

.trail-3 {
    background-image: url("../assets/cheese.png") !important;
    background-size: 50px 50px;
    background-position: center;
    background-repeat: no-repeat;
}

.i-am-survivor {
    background-image: url("../assets/survivor.gif") !important;
    background-size: 70px 70px;
    background-position: center;
    background-repeat: no-repeat;
    cursor: default !important;
}


@media only screen and (max-width: 600px) {
    .col {
        font-size: 12px;
        margin: 1px;
        height: 40px;
        width: 40px;
    }

    .active {
        background-size: 40px 40px;
    }

    .survivor-near {
        background-size: 40px 40px;
    }

    .lower-res-screen {
        flex-direction: column;
    }
}
</style>


