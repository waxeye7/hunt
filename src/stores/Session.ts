import { defineStore } from "pinia";
import type * as Realm from "realm-web";
import SessionApi from "../api/Session";
import type { Session } from "../types/Session";

interface ISessionStore {
  session: Session | null;
}

export const useSessionStore = defineStore("session", {
  state: (): ISessionStore => ({ session: null }),
  actions: {
    async createSession() {
      this.session = await SessionApi.createSession();
    },
    async getSession(sessionId: string) {
      this.session = await SessionApi.getSession(sessionId);
    },
    async getSessions() {
      return await SessionApi.getSessions();
    },
    async addGameToCurrentSession(gameCode: string) {
      this.session = await SessionApi.addGameToSession(
        gameCode,
        this.session._id
      );
    },
  },
});
