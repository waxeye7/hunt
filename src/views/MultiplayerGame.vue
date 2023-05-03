<script setup lang="ts">
import MultiplayerBoard from "../components/MultiplayerBoard.vue";
</script>

<template>
    <div class="relative">

        <MultiplayerBoard @gameEnd="gameEnd" />


    </div>
</template>

<script lang="ts">
export default {
    methods: {
        gameEnd() {
            console.log("Game ended");
        }
    }
}
</script>