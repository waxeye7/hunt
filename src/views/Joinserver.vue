<script setup>
import AbsoluteGuys from "../components/AbsoluteGuys.vue";
import { getGameByCode, updateGameByCode } from "../utils/realm";
</script>

<template>
    <div class="container flex flex-col center relative">
        <AbsoluteGuys />
        <div v-if="!hasJoined">
            <p>ENTER THE GAME CODE</p>
            <div class="flex">
                <input v-model="gameCode" type="text">
                <button class="go" @click="joinGame">Go</button>
            </div>
            <h1>{{ gameCode }}</h1>
        </div>
        <div v-else>YOU HAVE SUCCESSFULLY JOINED</div>
        
    </div>
</template>

<script>
    export default {
        data() {
            return {
                gameCode: "",
                hasJoined: false,
            }
        },
        methods: {
            async joinGame() {
                const game = await getGameByCode(this.gameCode);
                console.log({game});
                const updateParams = game.hunter.has_connected ? {"survivor.has_connected": true} : {"hunter.has_connected": true};
                console.log({game}, {updateParams})
                await updateGameByCode(this.gameCode, updateParams);
                this.hasJoined = true;
            }
        }
    }
</script>

<style scoped>
.go {
    margin-left:10px;
    padding:4px;
    color:rgb(0, 0, 0);
    cursor: pointer;
}
p{
    margin-bottom:8px;
}
.container {
    height:calc(100vh - 46px);
    background-color:white !important;
}
.center {
    justify-content: center;
    align-items: center;
}
</style>
