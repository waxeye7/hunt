<script setup lang="ts">
import TitleComponent from "../components/Title.vue";
import BoardComponent from "../components/Board.vue";
</script>

<template>
    <div>
        <BoardComponent :timesWon="timesWon" @updateTimesWon="get_times_won" />
        
    </div>
</template>

<style scoped>

</style>

<script lang="ts">
    export default {
        data() {
            return {
                timesWon:0,
            }
        },
        methods:{
            get_times_won(timesWon) {
                this.timesWon = timesWon;
            }
        }
    }
</script>
