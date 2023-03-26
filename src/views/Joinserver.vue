<script setup lang="ts">
import AbsoluteGuys from "../components/silly/AbsoluteGuys.vue";
import { mapStores } from 'pinia'
import { useAuthStore } from "../stores/Auth";
import { useGameStore } from "../stores/Game";
import router from "../router";
</script>

<template>
  <div class="h-screen-minus-46 bg-green-400 flex flex-col items-center relative">
    <AbsoluteGuys />
    <div v-if="!hasJoined" class="flex flex-col items-center">
      <p class="text-lg font-semibold mb-2">ENTER THE GAME CODE</p>
      <div class="flex">
        <input v-model="gameCode" type="text" class="bg-gray-200 rounded-lg py-2 px-4 mr-2">
        <button class="bg-blue-500 py-2 px-4 rounded-lg text-white cursor-pointer" @click="joinGame">Go</button>
      </div>
      <h1 class="text-xl font-bold mt-4">{{ gameCode }}</h1>
    </div>
    <div v-else class="text-xl font-bold">YOU HAVE SUCCESSFULLY JOINED</div>
  </div>
</template>

<script lang="ts">
export default {
  data() {
    return {
      gameCode: "",
      hasJoined: false,
    }
  },
  computed: {
    ...mapStores(useAuthStore, useGameStore)
  },
  methods: {
    async joinGame() {
      await this.authStore.init();
      await this.gameStore.getGameByCode(this.gameCode);
      const playerType = this.gameStore.hunter.has_connected ? "survivor" : "hunter";
      this.gameStore.currentPlayerType = playerType;
      const updateParams = this.gameStore.hunter.has_connected ? { "survivor.has_connected": true } : { "hunter.has_connected": true };
      await this.gameStore.updateGameByCode(this.gameCode, updateParams);
      await this.gameStore.getGameByCode(this.gameCode);

      router.push(`/multiplayer/play/${this.gameStore.gameCode}`);
    }
  },
}
</script>

<style scoped></style>
