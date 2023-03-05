<script setup>
import AbsoluteGuys from "../components/AbsoluteGuys.vue";
import { mapStores } from 'pinia'
import { useAuthStore } from "../stores/auth";
import { useGameStore } from "../stores/game";
</script>

<template>
    <div class="container relative">
        <AbsoluteGuys />
        <div>WELCOME YOU ARE PLAYING AS A {{ gameStore.currentPlayerType }}</div>
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
        computed: {
            ...mapStores(useAuthStore, useGameStore)
        },
        methods: {
        },
    }
</script>