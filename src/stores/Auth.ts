import { defineStore } from 'pinia';
import * as Realm from "realm-web";
import AuthApi from '../api/Auth';

interface IAuthStore {
  app: Realm.App | null;
}

export const useAuthStore = defineStore('auth', {
  state: (): IAuthStore => ({ app: null }),
  getters: {
    currentUser: (state) => state.app?.currentUser,
  },
  actions: {
    async init() {
      if (this.app) {
        return;
      }
      this.app = await AuthApi.init();
    },
  },
})