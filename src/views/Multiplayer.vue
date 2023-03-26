<script setup lang="ts">
import AbsoluteGuys from "../components/silly/AbsoluteGuys.vue";
</script>

<template>
    <div class="h-screen-minus-46 bg-green-400 flex flex-col justify-center items-center relative">
        <AbsoluteGuys />
        <div class="text-center mb-10">
            <h1 class="text-4xl">Choose</h1>
            <h1 class="text-4xl">Create or Join</h1>
        </div>
        <div class="flex flex-col items-center pb-24">
            <router-link to="/multiplayer/create"
                class="text-white bg-gray-800 px-8 py-4 text-2xl rounded-lg shadow-lg mb-4 hover:bg-black transition duration-300">Create
                Game</router-link>
            <router-link to="/multiplayer/join"
                class="text-white bg-gray-800 px-8 py-4 text-2xl rounded-lg shadow-lg hover:bg-black transition duration-300">Join
                Game</router-link>
        </div>
        <div class="absolute left-1/2 transform -translate-x-1/2 bottom-16 text-center text-xl">
            <h1>87 Players Online</h1>
        </div>
    </div>
</template>

<style scoped>
/* No need for .txt-block class, we can apply the styles directly to the h1 tags */
.text-center {
    text-align: center;
}

.container {
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.link-style {
    text-decoration: none;
}

/* No need for .links class, we can apply the styles directly to the router-link tags */
router-link {
    width: 200px;
    margin-top: 20px;
    text-align: center;
}
</style>
