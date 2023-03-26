import * as Realm from "realm-web";
import { useAuthStore } from "../stores/Auth";
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
        return mongo.db(dbName).collection("Sessions");
    },
    createSession: async () => {
        const authStore = useAuthStore();
        await authStore.init();
        const sessions = await SessionApi.getSessions();
        const newSession = {
            games: [],
            createdAt: new Date(),
        };
        await sessions?.insertOne(newSession);
        return newSession;
    },
    getCurrentSession: async () => {
        const authStore = useAuthStore();
        await authStore.init();
        const sessions = await SessionApi.getSessions();

        if (await sessions?.count() === 0) {
            return;
        }

        const currentSession = await sessions?.findOne({}, { sort: { createdAt: -1 } });
        return currentSession;
    },
    addGameToCurrentSession: async (gameId) => {
        const currentSession = await SessionApi.getCurrentSession();

        if (!currentSession) {
            return;
        }

        const updatedGames = currentSession.games.concat(gameId);
        const sessions = await SessionApi.getSessions();
        await sessions?.updateOne(
            { _id: currentSession._id },
            { $set: { games: updatedGames } }
        );
    },
};
