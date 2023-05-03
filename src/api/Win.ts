import * as Realm from "realm-web";
import { useAuthStore } from "../stores/Auth";
import type { Win } from "../types/Win";
const dataSrc = "mongodb-atlas";
const dbName = "Hunt";
const WinApi = {
  getWins: async () => {
    const authStore = useAuthStore();
    const user = authStore.currentUser;

    if (!user) {
      return;
    }

    const mongo = user.mongoClient(dataSrc);
    return mongo.db(dbName).collection<Win>("Wins");
  },
  incrementWins: async () => {
    const authStore = useAuthStore();
    await authStore.init();
    const wins = await WinApi.getWins();
    if ((await wins?.count()) === 0) return;
    const win = await wins?.findOne();
    const amount = win.amount;
    await wins?.updateOne({}, { amount: amount + 1 });
  },
  getWinAmount: async () => {
    const authStore = useAuthStore();
    await authStore.init();
    const wins = await WinApi.getWins();

    if ((await wins?.count()) === 0) return;

    const win = await wins?.findOne();
    return win.amount;
  },
};

export default WinApi;
