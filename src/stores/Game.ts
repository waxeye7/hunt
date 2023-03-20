import { defineStore } from "pinia";
import GameApi from "../api/Game";
import type { Game, PlayerType, Board, Pos } from "../types/Game";

interface IGameStore {
  game: Game | null;
  currentPlayerType: PlayerType | null;
}

export const useGameStore = defineStore("game", {
  state: (): IGameStore => ({ game: null, currentPlayerType: null }),
  getters: {
    hunter: (state) => state.game?.hunter,
    survivor: (state) => state.game?.survivor,
    board: (state) => state.game?.board,
    gameCode: (state) => state.game?.code,
  },
  actions: {
    async createGame(
      playerType: PlayerType,
      gameCode: string,
      gameBoard: Board,
      hunterStartingPos: Pos
    ) {
      if (this.game) {
        return;
      }
      return await GameApi.createGame(
        playerType,
        gameCode,
        gameBoard,
        hunterStartingPos
      );
    },

    async getGames() {
      return await GameApi.getGames();
    },

    async updateGameByCode(code: string, updateParams = {}) {
      return await GameApi.updateGameByCode(code, updateParams);
    },

    async getGameByCode(code: string) {
      this.game = await GameApi.getGameByCode(code);
    },
  },
});
