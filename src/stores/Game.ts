import { defineStore } from 'pinia';
import GameApi from '../api/Game';
import { Game, PlayerType } from '../types/Game';

interface IGameStore {
  game: Game | null;
  currentPlayerType: PlayerType | null;
}

export const useGameStore = defineStore('game', {
  state: (): IGameStore => ({ game: null, currentPlayerType: null }),
  getters: {
    hunter: (state) => state.game?.hunter,
    survivor: (state) => state.game?.survivor,
    board: (state) => state.game?.board,
    gameCode: (state) => state.game?.code,
  },
  actions: {
    async createGame(playerType: PlayerType, gameCode: string) {
      if (this.game) {
        return;
      }
      return await GameApi.createGame(playerType, gameCode);
    },

    async getGames() {
      if (!this.game) {
        return;
      }
      return await GameApi.getGames();
    },

    async updateGameByCode(code: string, updateParams = {}) {
      if (!this.game) {
        return;
      }
      return await GameApi.updateGameByCode(code, updateParams);
    },

    async getGameByCode(code: string) {
      if (this.game) {
        return;
      }
      this.game = await GameApi.getGameByCode(code);
    },

    async syncGame(code?: string) {
      if (!this.game || !this.gameCode) {
        return;
      }
      this.game = await GameApi.getGameByCode(code ?? this.gameCode);
    }
  },
})