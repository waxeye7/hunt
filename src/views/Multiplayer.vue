<script setup lang="ts">
import AbsoluteGuys from "../components/silly/AbsoluteGuys.vue";
</script>

<template>
    <div class="h-screen-minus-46 bg-green-400 flex flex-col justify-center align-center relative">
        <AbsoluteGuys />


        <h1 class="text-center mb-10 text-4xl font-semibold">Create or Join</h1>

        <div class="flex flex-col items-center pb-24">
            <router-link to="/multiplayer/create"
                class="w-[240px] h-[70px] text-center text-white hover:bg-gray-800 px-8 py-4 text-2xl rounded-lg shadow-lg mb-4 bg-black transition duration-300">Create
                Game</router-link>
            <router-link to="/multiplayer/join"
                class="w-[240px] h-[70px] text-center text-white hover:bg-gray-800 px-8 py-4 text-2xl rounded-lg shadow-lg bg-black transition duration-300">Join
                Game</router-link>
        </div>
        <div class="absolute left-1/2 transform -translate-x-1/2 bottom-16 text-center text-xl">
            <h1>87 Players Online</h1>
        </div>
    </div>
</template>
