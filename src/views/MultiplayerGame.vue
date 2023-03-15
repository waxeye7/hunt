<script setup>
import MultiplayerBoard from "../components/MultiplayerBoard.vue";

import { mapStores } from 'pinia'
import { useAuthStore } from "../stores/auth";
import { useGameStore } from "../stores/game";


</script>

<template>
    <div class="container relative">

        <MultiplayerBoard :game_store="this.gameStore.game" :player_type="this.gameStore.currentPlayerType" />
        
        
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
        created() {

        }
    }
</script>