import * as Realm from "realm-web";

export const app = new Realm.App({ id: 'hunt-application-sync-nuthi' });

const {
    BSON: { ObjectId },
  } = Realm;

const dataSrc = "mongodb-atlas";
const dbName = "Hunt";

interface Player {
    pos: {
        x: number,
        y: number,
    },
    has_connected: boolean,
    has_moved: boolean,
}

interface Game {
    hunter: Player,
    survivor: Player,
    code: string,
}

type PlayerType = "hunter" | "survivor";

const defaultPlayer: Player = {
    pos: {
        x: 0,
        y: 0
    },
    has_connected: false,
    has_moved: false,
}

export const getUser = async () => {
    const credentials = Realm.Credentials.anonymous();
    // Authenticate the user
    return await app.logIn(credentials);
}

export const createGame = async (playerType: PlayerType, gameCode: string) => {
    const hunter = { ...defaultPlayer };
    hunter.has_connected = playerType === "hunter";
    const survivor =  { ...defaultPlayer };
    survivor.has_connected = playerType === "survivor";

    const game: Game = {
        hunter,
        survivor,
        code: gameCode,
    }

    const games = await getGames();

    if (!games) return;

    return await games?.insertOne(game);
}

export const getGames = async () => {
    const user = await getUser();

    if (!user) {
        return;
    }

    const mongo = user.mongoClient(dataSrc);
    return mongo.db(dbName).collection('Games');
}

export const updateGameByCode = async (code: string, updateParams = {}) => {
    const games = await getGames();
    return await games?.updateOne(
        {code},
        { $set: updateParams }
    );
}

export const getGameByCode = async (code: string) => {
    const user = await getUser();
    const mongo = user.mongoClient(dataSrc);
    const collection = mongo.db(dbName).collection('Games');
    return await collection.findOne({ code });
}