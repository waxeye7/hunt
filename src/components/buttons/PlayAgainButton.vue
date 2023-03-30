<script setup lang="ts">
import randomWords from "random-words";
import { mapStores } from "pinia";
import { useGameStore } from "../../stores/Game";
import { useSessionStore } from "../../stores/Session";
import router from "../../router";
import { emit } from "process";
</script>

<template>
  <div @click="playAgain"
    class="button w-[140px] mt-4 hover:bg-opacity-70 hover:shadow-2xl rounded-bl-none rounded-t hover:scale-x-105 hover:scale-y-105 ease-out duration-100">
    Play Again
  </div>
</template>

<script lang="ts">
export default {
  data() {
    return {
      gameBoard: [],
      waterChance: 30, //TODO: Make this a variable that can be changed by the user
      waterBoardPositions: null,
      hunterStartingPos: null,
    }
  },
  computed: {
    ...mapStores(useGameStore, useSessionStore),
    boardCols() {
      return this.gameStore.board[0].length
    },
    boardRows() {
      return this.gameStore.board.length
    },
    startingSquare() {
      return [Math.floor(this.boardCols / 2), Math.floor(this.boardRows / 2)]
    },
    boardSize() {
      return this.boardCols * this.boardRows;
    },
  },

  methods: {
    async playAgain() {
      // Create a new game with the same players
      const newGameCode = randomWords(3).join("-"); // Implement a function to generate a new game code
      this.createGameBoard(); // Implement a function to generate a new game board

      const gameCode = await this.gameStore.createGame(
        this.gameStore.currentPlayerType,
        newGameCode,
        this.gameBoard,
        this.hunterStartingPos
      );

      console.log({gameCode}, {gameBoard: this.gameBoard})

      // Update the game store with the new game code
      await this.gameStore.getGameByCode(gameCode);
      console.log(this.gameStore.game);

      // Add the new game to the current session
      await this.sessionStore.addGameToCurrentSession(newGameCode);

      // Navigate to the new game
      router.push(`/multiplayer/play/${newGameCode}`);
      this.$emit("playAgain");
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
  },
}
</script>
