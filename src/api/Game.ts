import * as Realm from "realm-web";
import { useAuthStore } from "../stores/Auth";
import { Game, PlayerType, Player } from '../types/Game';

const {
  BSON: { ObjectId },
} = Realm;

const dataSrc = "mongodb-atlas";
const dbName = "Hunt";

const defaultPlayer: Player = {
    pos: {
        x: 0,
        y: 0
    },
    has_connected: false,
    has_moved: false,
}

const GameApi = {
  createGame: async (playerType: PlayerType, gameCode: string) => {
    const hunter = { ...defaultPlayer };
    hunter.has_connected = playerType === "hunter";
    const survivor = { ...defaultPlayer };
    survivor.has_connected = playerType === "survivor";

    const game: Game = {
      hunter,
      survivor,
      code: gameCode,
    };

    const games = await GameApi.getGames();
    if (!games) return;

    return await games?.insertOne(game);
  },
  
  getGames: async () => {
    const authStore = useAuthStore();
    const user = authStore.currentUser;

    if (!user) {
        return;
    }

    const mongo = user.mongoClient(dataSrc);
    return mongo.db(dbName).collection('Games');
  },

  updateGameByCode: async (code: string, updateParams = {}) => {
    const games = await GameApi.getGames();
    return await games?.updateOne(
        {code},
        { $set: updateParams }
    );
  },

  getGameByCode: async (code: string) => {
    const authStore = useAuthStore();
    const user = authStore.currentUser;

    if (!user) {
      return;
    }

    const mongo = user.mongoClient(dataSrc);
    const collection = mongo.db(dbName).collection('Games');
    return await collection.findOne({ code });
  }
}

export default GameApi;