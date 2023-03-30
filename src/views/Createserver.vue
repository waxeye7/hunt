<script setup lang="ts">
import randomWords from "random-words";
import AbsoluteGuys from "../components/silly/AbsoluteGuys.vue";
import { mapStores } from 'pinia'
import { useAuthStore } from "../stores/Auth";
import { useGameStore } from "../stores/Game";
import router from "../router";

import SessionApi from "../api/SessionApi";

import CopyToClipboardButton from "../components/buttons/CopyToClipboardButton.vue";

</script>

<template>
  <div class="h-screen-minus-46 bg-green-400 flex flex-col items-center justify-center relative">
    <AbsoluteGuys />
    <div v-if="!bothConnected">
      <div v-if="!created">
        <h1 class="text-3xl font-bold mb-4 text-center">CHOOSE PLAYER TYPE</h1>
        <div class="flex space-x-4 justify-center">
          <div @click="playerType = 'hunter'" class="bg-blue-700 py-2 px-4 rounded-lg text-white cursor-pointer">HUNTER
          </div>
          <div @click="playerType = 'survivor'" class="bg-blue-700 py-2 px-4 rounded-lg text-white cursor-pointer">
            SURVIVOR</div>
        </div>

        <img v-if="!playerType" src="../assets/not_decided.png"
          class="h-[200px] w-[200px] p-8 mx-auto border-4 border-solid border-black bg-white mt-4">
        <img v-else-if="playerType === 'survivor'" src="../assets/survivor.gif"
          class="h-[200px] w-[200px] p-8 mx-auto border-4 border-solid border-black bg-pink-500 mt-4">
        <img v-else-if="playerType === 'hunter'" src="../assets/hunt.gif"
          class="h-[200px] w-[200px] p-8 mx-auto border-4 border-solid border-black bg-red-500 mt-4">


        <p v-if="!playerType" class="text-lg font-semibold mt-4 text-center">YOUR PLAYER TYPE: is undefined</p>
        <p v-else class="text-lg font-semibold mt-4 text-center">YOUR PLAYER TYPE: {{ playerType }}</p>

        <div class="flex align-center justify-center mt-4">
          <div @click="modal = true"
            class="z-100 w-[180px] text-lg font-normal text-center bg-blue-700 py-2 px-4 rounded-lg text-white cursor-pointer">
            Advanced Settings
          </div>

          <div v-if="modal" class="z-[50] w-screen h-screen-minus-46 fixed top-0 left-0">
            <div class="relative w-screen h-screen-minus-46">
              <div
                class="w-[350px] h-[500px] top-[27%] left-1/2 transform -translate-x-1/2 z-[100] bg-black absolute flex flex-col justify-center rounded-xl">


                <h1 class="text-center text-white text-2xl font-bold py-4">Advanced Settings</h1>
                <hr class="h-px w-[92%] mb-4 mx-auto my-2 bg-gray-200 border-0 dark:bg-white">


                <div class="mx-4">
                  <label for="boardCols" class="block text-lg font-semibold text-white">Columns: {{ tempCols
                  }}</label>
                  <input v-model="tempCols" id="boardCols" type="range" min="3" max="10"
                    class="w-full h-2 bg-white rounded-lg appearance-none cursor-pointer mb-4">

                  <label for="boardRows" class="block text-lg font-semibold text-white">Rows: {{ tempRows
                  }}</label>
                  <input v-model="tempRows" id="boardRows" type="range" min="3" max="10"
                    class="w-full h-2 bg-white rounded-lg appearance-none cursor-pointer mb-4">

                  <label for="waterChance" class="block text-lg font-semibold text-white">Water Chance: {{ tempWaterChance
                  }}%</label>
                  <input v-model="tempWaterChance" id="waterChance" type="range" min="0" max="100" step="10"
                    class="w-full h-2 bg-white rounded-lg appearance-none cursor-pointer mb-4">


                </div>


                <div class="flex mt-auto">
                  <div @click="modal = false; declineSettings()"
                    class="text-center py-2 text-xl my-auto bg-red-400 flex-1 border-4 border-black cursor-pointer border-r-2 font-semibold">
                    Cancel</div>
                  <div @click="modal = false; applySettings()"
                    class="text-center py-2 text-xl bg-green-500 flex-1 border-4 border-black cursor-pointer border-l-2 font-semibold">
                    Confirm
                  </div>

                </div>


              </div>

            </div>

          </div>

          <div :class="{ 'opacity-50': !playerType }" @click="create"
            class="ml-4 w-[150px] text-center text-lg bg-orange-600 py-2 px-4 rounded-lg text-white cursor-pointer font-semibold ">
            Create Game</div>
        </div>
      </div>


      <div v-else>
        <div class="flex flex-col justify-center align-center">

          <p class="text-lg font-semibold mb-2">{{ gameCode }}</p>
          <CopyToClipboardButton buttonText="Copy Game Code To Clipboard" :message-to-copy="gameCode" class="mb-2" />
          <CopyToClipboardButton buttonText="Copy Game URL To Clipboard" :message-to-copy="shareableLink" />
          <h1 class="text-3xl font-bold mb-4 mt-4">Waiting for
            Opponent to join...</h1>
          <!-- <img class="h-[300px] w-[300px]" src="../assets/mr-bean-waiting.gif"> -->
        </div>


      </div>
    </div>
    <div v-else>YOUR OPPONENT HAS CONNECTED</div>
  </div>
</template>

<script lang="ts">
export default {
  data() {
    return {
      tempWaterChance: 30,
      tempCols: 5,
      tempRows: 5,
      modal: false,
      waterBoardPositions: null,
      playerType: null, // "survivor" or "hunter",
      gameCode: '',
      shareableLink: '',
      gameBoard: [],
      boardCols: 5,
      boardRows: 5,
      waterChance: 30,
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
    applySettings() {
      this.boardCols = this.tempCols;
      this.boardRows = this.tempRows;
      this.waterChance = this.tempWaterChance;
    },
    declineSettings() {
      this.tempCols = this.boardCols;
      this.tempRows = this.boardRows;
      this.tempWaterChance = this.waterChance;
    },

    async create() {
      if (this.playerType) {
        await this.authStore.init();
        this.gameCode = randomWords(3).join("-");

        this.createGameBoard();

        this.gameStore.currentPlayerType = this.playerType;
        const { gameCode, shareableLink } = await this.gameStore.createGame(this.playerType, this.gameCode, this.gameBoard, this.hunterStartingPos);
        this.shareableLink = shareableLink;
        await this.gameStore.getGameByCode(this.gameCode);
        this.created = true;

        const newSession = await SessionApi.createSession();
        await SessionApi.addGameToCurrentSession(this.gameCode);



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