<script setup lang="ts">
import randomWords from "random-words";
import AbsoluteGuys from "../components/silly/AbsoluteGuys.vue";
import { mapStores } from 'pinia'
import { useAuthStore } from "../stores/Auth";
import { useGameStore } from "../stores/Game";
import router from "../router";
</script>

<template>
  <div class="h-screen-minus-46 bg-green-400 flex flex-col items-center relative">
    <AbsoluteGuys />
    <div class="flex flex-col items-center">
      <div v-if="!bothConnected">
        <div v-if="!created">
          <h1 class="text-3xl font-bold mb-4 text-center">CHOOSE YOUR PLAYER TYPE</h1>
          <div class="flex space-x-4 justify-center">
            <div @click="playerType = 'hunter'" class="bg-blue-500 py-2 px-4 rounded-lg text-white cursor-pointer">HUNTER
            </div>
            <div @click="playerType = 'survivor'" class="bg-blue-500 py-2 px-4 rounded-lg text-white cursor-pointer">
              SURVIVOR</div>
          </div>

          <p class="text-lg font-semibold mt-4 text-center">YOUR PLAYER TYPE: {{ playerType }}</p>

          <div v-if="playerType" @click="create"
            class="text-center w-64 bg-blue-500 py-2 px-4 rounded-lg text-white cursor-pointer mt-4 ml-auto mr-auto">
            CREATE GAME</div>
        </div>
        <div v-else>
          <p class="text-lg font-semibold">THIS IS YOUR CODE: {{ gameCode }}</p>
          <h1 class="text-3xl font-bold mb-4">Waiting for Opponent to join...</h1>
          <img class="mr-bean" src="../assets/mr-bean-waiting.gif" alt="">
          <div class="pb-72"></div>
        </div>
      </div>
      <div v-else>YOUR OPPONENT HAS CONNECTED</div>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  data() {
    return {
      waterBoardPositions: null,
      playerType: null, // "survivor" or "hunter",
      gameCode: '',
      gameBoard: [],
      boardCols: 5,
      boardRows: 5,
      waterChance: 40,
      hunterStartingPos: null,
      created: false,
      bothConnected: false,
      victory: null,
      running: null
    }
  },
  computed: {
    ...mapStores(useAuthStore, useGameStore),

    startingSquare() {
      return [Math.floor(this.boardCols / 2), Math.floor(this.boardRows / 2)]
    },
    boardSize() {
      return this.boardCols * this.boardRows;
    },
  },
  methods: {
    async create() {
      await this.authStore.init();
      this.gameCode = randomWords(3).join("-");

      this.createGameBoard();

      this.gameStore.currentPlayerType = this.playerType;
      await this.gameStore.createGame(this.playerType, this.gameCode, this.gameBoard, this.hunterStartingPos);
      await this.gameStore.getGameByCode(this.gameCode);
      this.created = true;



      const games = await this.gameStore.getGames();
      for await (const change of games.watch({
        filter: {
          operationType: "update",
          "fullDocument.code": this.gameCode,
        },
      })) {
        // The change event will always represent a newly inserted perennial
        if (change.operationType !== "update") {
          continue;
        }
        const { fullDocument } = change;
        const { hunter, survivor } = fullDocument;
        if ((this.playerType === "hunter" && survivor.has_connected) || (this.playerType === "survivor" && hunter.has_connected)) {
          this.bothConnected = true;
          await this.gameStore.getGameByCode(this.gameCode);

          router.push(`/multiplayer/play/${this.gameStore.gameCode}`);
        }
      }
    },
    createGameBoard() {
      this.gameBoard = [];
      this.waterBoardPositions = [];
      let boardList = [...Array(this.boardRows)].map(() => Array(this.boardCols));
      let rowNum = 0;
      let squareNumber = 1;
      for (let row of boardList) {
        let colNum = 0;
        let rowList = [];
        let waterRowList = [];
        for (let squareInRow of row) {
          rowList.push(this.createSquareObject(colNum, rowNum, squareNumber));
          if (colNum == this.startingSquare[0] && rowNum == this.startingSquare[1]) {
            waterRowList.push({
              pos: {
                x: colNum,
                y: rowNum
              },
              water: false,
              id: 2
            });
          }
          else {
            waterRowList.push(
              {
                pos: {
                  x: colNum,
                  y: rowNum
                },

                water: true,
                id: 0
              });
          }
          colNum += 1;
          squareNumber += 1;
        }
        rowNum += 1;
        this.gameBoard.push(rowList);
        this.waterBoardPositions.push(waterRowList);
      }
      this.createPassableTiles();
      this.victory = false;
      this.running = true;

      this.gameBoard[this.startingSquare[1]][this.startingSquare[0]].has_hunter = true;
      this.hunterStartingPos = { x: this.startingSquare[0], y: this.startingSquare[1] };
    },
    createPassableTiles() {
      let more_tiles = true;
      let currentNumber = 2;
      while (more_tiles) {
        more_tiles = false;
        let rowNum = 0;
        for (let row of this.waterBoardPositions) {
          let colNum = 0;
          for (let col of row) {
            let square = row[colNum];
            if (row[colNum].id == currentNumber) {
              let neighbours = this.findAdjacentTiles(square, this.waterBoardPositions);
              let squaresChanged = 0;
              for (let n of neighbours) {
                let random;
                random = Math.floor(Math.random() * 10) + 1;
                if (random <= Math.floor(this.waterChance / 10)) {
                  // make water if random within chance of waterchance
                  if (n.id == 0) {
                    n.id = 1;
                  }
                }
                else {
                  // dont make water, random didn't hit
                  if (n.id == 0) {
                    squaresChanged++;
                    n.water = false;
                    n.id = currentNumber + 1;
                    more_tiles = true;
                  }
                }
              }
              if (currentNumber == 2 && squaresChanged == 0) {
                let random = Math.floor(Math.random() * 6);
                let chosen = neighbours[random];
                chosen.water = false;
                chosen.id = 3;
                more_tiles = true;
              }
            }
            colNum++;
          }
          rowNum++;

        }
        currentNumber++;
      }

      let rowNum = 0;
      for (let row of this.gameBoard) {
        let colNum = 0;
        for (let col of row) {
          if (this.waterBoardPositions[rowNum][colNum].water) {
            col.terrain.active = false;
          }
          colNum++;
        }
        rowNum++;
      }
    },
    findAdjacentTiles(currentLocation, listOfObjects) {
      let neighbours = [];
      if (currentLocation && currentLocation.pos) {
        for (let i = -1; i <= 1; i++) {
          for (let o = -1; o <= 1; o++) {
            let x = i + currentLocation.pos.x;
            let y = o + currentLocation.pos.y;
            if (x >= 0 && y >= 0 && this.boardRows - 1 >= y && this.boardCols - 1 >= x && (x !== currentLocation.pos.x || y !== currentLocation.pos.y)) {
              if (listOfObjects[y][x]) {
                if (currentLocation.pos.y % 2 == 0 && (currentLocation.pos.x + 1 == x && (currentLocation.pos.y - 1 == y || currentLocation.pos.y + 1 == y)) ||
                  currentLocation.pos.y % 2 == 1 && (currentLocation.pos.x - 1 == x && (currentLocation.pos.y - 1 == y || currentLocation.pos.y + 1 == y))) {

                }
                else {
                  neighbours.push(listOfObjects[y][x]);
                }
              }
            }
          }
        }
      }

      return neighbours;
    },
    createSquareObject(x, y, squareNumber) {
      let square = {
        id: squareNumber,
        pos: {
          x: x,
          y: y
        },
        survivor_trail: {
          strength: 0,
          show: true,
        },
        terrain: {
          active: true,
          passable: true,
        },
        has_hunter: false,
        has_survivor: false,
      };
      return square;
    },
  }
}
</script>

<style scoped>
.mr-bean {
  margin-right: auto;
  margin-left: auto;
  display: block;
  margin-top: 24px;
}
</style>
