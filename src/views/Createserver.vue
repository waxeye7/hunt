<script setup>
import randomWords from "random-words";
import AbsoluteGuys from "../components/AbsoluteGuys.vue";
import { mapStores } from 'pinia'
import { useAuthStore } from "../stores/auth";
import { useGameStore } from "../stores/game";
import router from "../router";
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
        computed: {
            ...mapStores(useAuthStore, useGameStore)
        },
        methods: {
            async create() {
                await this.authStore.init();
                this.gameCode = randomWords(3).join("-");

                this.gameStore.currentPlayerType = this.playerType;
                await this.gameStore.createGame(this.playerType, this.gameCode);
                await this.gameStore.getGameByCode(this.gameCode);
                this.created = true;

                const games = await this.gameStore.getGames();
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
                        await this.gameStore.syncGame();
                        router.push(`/multiplayer/play/${this.gameStore.gameCode}`);
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
