<script setup lang="ts">
import AbsoluteGuys from "../components/silly/AbsoluteGuys.vue";
import WinApi from "../api/Win";
</script>

<template>
    <div class="h-screen-minus-46 container mx-auto flex flex-col justify-center">
        <AbsoluteGuys />
        <div class="menu-card bg-black p-16 text-white rounded-lg mb-3 mx-auto text-center">
            <div class="txt-block">
                <h1 class="text-xl">Welcome To</h1>
                <h1 class="text-2xl">The Hunting Game!</h1>
            </div>
            <div class="links flex flex-col items-center pb-8">
                <router-link to="/singleplayer" class="link-style">Singleplayer</router-link>
                <router-link to="/multiplayer" class="link-style">Multiplayer</router-link>
            </div>
            <div class="text-center text-lg">
                <h3>87 Players Online</h3>
            </div>
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



<style scoped>
.link-style {
    @apply no-underline mt-5 px-8 py-6 bg-white text-black text-xl w-48 text-center rounded-md shadow-md;
}

.link-style:hover {
    @apply bg-green-600 text-white shadow-lg;
}
</style>