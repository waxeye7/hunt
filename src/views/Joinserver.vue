<script setup lang="ts">
import AbsoluteGuys from "../components/silly/AbsoluteGuys.vue";
import { mapStores } from 'pinia'
import { useAuthStore } from "../stores/Auth";
import { useGameStore } from "../stores/Game";
import { useSessionStore } from "../stores/Session";
import router from "../router";
</script>

<template>
  <div class="h-screen-minus-46 bg-green-400 flex flex-col items-center justify-center relative">
    <AbsoluteGuys />
    <div v-if="!hasJoined" class="flex flex-col items-center">
      <p class="text-lg font-semibold mb-2">Enter your Game Code</p>
      <div class="flex relative">
        <input @keyup.enter="joinGameAndSession" v-model="gameCode" type="text" class="bg-gray-200 py-2 px-2">
        <button class="bg-blue-500 py-2 px-4  text-white cursor-pointer" @click="joinGameAndSession">Enter</button>
        <img v-if="joining" src="../assets/loading.gif" class="absolute top-[-42px] left-[264px] h-[100px] w-[96px]">
      </div>
    </div>
    <div v-else class="text-xl font-bold">YOU HAVE SUCCESSFULLY JOINED</div>
  </div>
</template>

<script lang="ts">
export default {
  data() {
    return {
      joining: false,
      gameCode: "",
      sessionId: "",
      hasJoined: false,
    }
  },
  computed: {
    ...mapStores(useAuthStore, useGameStore, useSessionStore)
  },
  methods: {
    async joinGameAndSession() {
      this.joining = true;
      await this.authStore.init();
      await this.gameStore.getGameByCode(this.gameCode);
      const playerType = this.gameStore.hunter.has_connected ? "survivor" : "hunter";
      this.gameStore.currentPlayerType = playerType;
      const updateParams = this.gameStore.hunter.has_connected ? { "survivor.has_connected": true } : { "hunter.has_connected": true };
      await this.gameStore.updateGameByCode(this.gameCode, updateParams);
      await this.gameStore.getGameByCode(this.gameCode);

      await this.sessionStore.getSession(this.sessionId);

      router.push(`/multiplayer/play/${this.gameStore.gameCode}`);
    },
    checkForGameCodeInURL() {
      const urlParams = new URLSearchParams(window.location.search);
   
      this.gameCode = urlParams.get("gameCode");
      this.sessionId = urlParams.get("sessionId");

         console.log({gameCode: this.gameCode, sessionId: this.sessionId})
      if (this.gameCode && this.sessionId) {
        this.joinGameAndSession();
      }
    },
  },

  beforeRouteUpdate(to, from, next) {
    this.checkForGameCodeInURL();
    next();
  },

  mounted() {
    console.log('here')
  this.checkForGameCodeInURL();
  },
}

</script>