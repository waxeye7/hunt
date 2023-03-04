<script setup>
import randomWords from "random-words";
import AbsoluteGuys from "../components/AbsoluteGuys.vue";
import { createGame, getGames } from "../utils/realm";
</script>

<template>
    <div class="container center flex flex-col relative">
        <AbsoluteGuys />
        <div class="flex flex-col center">
            <div v-if="!bothConnected">
                <div v-if="!created">
                    <h1>CHOOSE YOUR PLAYER TYPE</h1>
                    <button @click="playerType = 'hunter'">HUNTER</button>
                    <button @click="playerType = 'survivor'">SURVIVOR</button>

                    <p>YOUR PLAYER TYPE: {{ playerType }}</p>

                    <button v-if="playerType" @click="create">CREATE GAME</button>
                </div>
                <div v-else>
                    <p>THIS IS YOUR CODE: {{ gameCode }}</p>
                    <h1 class="margin-bottom-tiny">Waiting for Opponent to join...</h1>
                    <img src="../assets/mr-bean-waiting.gif" alt="">
                    <div class="much-padding-bottom"></div>
                </div>
            </div>
            <div v-else>YOUR OPPONENT HAS CONNECTED</div>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                playerType: '', // "survivor" or "hunter",
                gameCode: '',
                created: false,
                bothConnected: false,
            }
        },
        methods: {
            async create() {
                this.gameCode = randomWords(3).join("-");
                console.log('creating');
                const game = await createGame(this.playerType, this.gameCode);
                console.log(game)
                this.created = true;

                const games = await getGames();
                for await (const change of games.watch({
                    filter: {
                        operationType: "update",
                        "fullDocument.code": this.gameCode,
                    },
                })) {
                    // The change event will always represent a newly inserted perennial
                    const { documentKey, fullDocument } = change;
                    const { hunter, survivor } = fullDocument;
                    if ((this.playerType === "hunter" && survivor.has_connected) || (this.playerType === "survivor" && hunter.has_connected)) {
                        this.bothConnected = true;
                    }
                }
            }
        }
    }
</script>

<style scoped>
.much-padding-bottom {
    padding-bottom: 76px;
}
.margin-bottom-much {
    margin-bottom: 80px;
}
.padding-top26percent {
    padding-top:26%;
}
.margin-bottom-tiny{
    margin-bottom:10px;
}
.container {
    height:calc(100vh - 46px);
    background-color:white !important;
}
.center {
    justify-content: center;
    align-items: center;
}
span{
    color:red;
}
</style>
