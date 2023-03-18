<script setup lang="ts">
import AbsoluteGuys from "../components/silly/AbsoluteGuys.vue";
import { mapStores } from 'pinia'
import { useAuthStore } from "../stores/Auth";
import { useGameStore } from "../stores/Game";
import router from "../router";
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

<style scoped>
.go {
  margin-left: 10px;
  padding: 4px;
  color: rgb(0, 0, 0);
  cursor: pointer;
}

p {
  margin-bottom: 8px;
}

.container {
  height: calc(100vh - 46px);
  background-color: rgba(86, 255, 71, 0.815) !important;
}

.center {
  justify-content: center;
  align-items: center;
}</style>
