<script setup>
 import BoardComponent from "./Board.vue";
</script>

<template>
    <div class="timer-till-lose">Timer:{{  timer  }}</div>
</template>

<style scoped>
.timer-till-lose {
    margin:-10px 0 30px 20px;
    display:flex;
    margin-left: 20px;    
    height:fit-content;
    border-radius: 4px;
    padding:10px;
    font-size: 34px;
    background-color:rgb(212, 210, 210);
    color:rgb(0, 0, 0);
}
</style>


<script>
    export default {
        props: {
            timer: {
                type: Number,
                required: true,
            }
        }
    }
    
</script>