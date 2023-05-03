import * as Realm from "realm-web";
import { useAuthStore } from "../stores/Auth";
import type { Session } from "../types/Session";

const {
  BSON: { ObjectId },
} = Realm;

const dataSrc = "mongodb-atlas";
const dbName = "Hunt";

const SessionApi = {
  getSessions: async () => {
    const authStore = useAuthStore();
    const user = authStore.currentUser;

    if (!user) {
      return;
    }

    const mongo = user.mongoClient(dataSrc);
    return mongo.db(dbName).collection<Session>("Sessions");
  },

  createSession: async () => {
    const sessions = await SessionApi.getSessions();
    const newSession: Omit<Session, "_id"> = {
      games: [],
      createdAt: new Date(),
    };
    const session = await sessions?.insertOne(newSession);
    return await SessionApi.getSession(session.insertedId);
  },

  getSession: async (sessionId: string) => {
    const sessions = await SessionApi.getSessions();

    if ((await sessions?.count()) === 0) {
      return;
    }

    const id = new ObjectId(sessionId);

    const currentSession = await sessions?.findOne({ _id: id });
    return currentSession;
  },

  addGameToSession: async (gameCode: string, sessionId: string) => {
    const currentSession = await SessionApi.getSession(sessionId);

    if (!currentSession) {
      return;
    }

    const updatedGames = currentSession.games.concat(gameCode);

    const sessions = await SessionApi.getSessions();
    await sessions?.updateOne(
      { _id: sessionId },
      { $set: { games: updatedGames } }
    );

    return await SessionApi.getSession(sessionId);
  },
};

export default SessionApi;
