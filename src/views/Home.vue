<script setup lang="ts">
import AbsoluteGuys from "../components/silly/AbsoluteGuys.vue";
import WinApi from "../api/Win";
</script>

<template>
    <div class="h-screen-minus-46 flex flex-col justify-center  bg-green-400 relative">
        <AbsoluteGuys />


        <h1 class="text-4xl text-center mb-10 relative font-semibold">The Hunting Game
            <h1 class="text-2xl text-center absolute top-[-30px] left-1/2 transform -translate-x-1/2 font-normal">Welcome
                To</h1>
        </h1>

        <div class="flex flex-col items-center pb-24">
            <router-link to="/singleplayer"
                class="w-[240px] h-[70px] text-center text-white hover:bg-gray-800 px-8 py-4 text-2xl rounded-lg shadow-lg mb-4 bg-black transition duration-300">Singleplayer</router-link>
            <router-link to="/multiplayer"
                class="w-[240px] h-[70px] text-center text-white hover:bg-gray-800 px-8 py-4 text-2xl rounded-lg shadow-lg bg-black transition duration-300">Multiplayer</router-link>
        </div>
        <div class="absolute left-1/2 transform -translate-x-1/2 bottom-16 text-center text-xl">
            <h1>87 Players Online</h1>
        </div>
    </div>
</template>


<script lang="ts">
export default {
    data() {
        return {
            pageviews_count: null,
            visits_count: null,
            wins: null,
        }
    },
    computed: {
    },
    methods: {
        updateCounter(type) {
            fetch('http://127.0.0.1:3002/api?' + type)
                .then(res => res.json())
                .then(data => {
                    this.pageviews_count = data.pageviews;
                    this.visits_count = data.visits;
                })
        }
    },
    async created() {
        this.wins = await WinApi.getWinAmount();

        if (sessionStorage.getItem('visit') === null) {
            this.updateCounter('type=visit-pageview');
        }
        else {
            this.updateCounter('type=pageview');
        }

        sessionStorage.setItem('visit', 'x');

    }
}
</script>
