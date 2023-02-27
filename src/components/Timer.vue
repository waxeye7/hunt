<script setup>
 import BoardComponent from "./Board.vue";
</script>

<template>
    <div :class="[(timer <= 5)?'five-turns-left':'',
    (timer <= 10 && timer > 5)?'ten-turns-left':'',
    (timer > 10)?'more-than-ten-turns-left':'']"
    class="timer-till-lose">Turns: {{  timer  }}</div>
</template>

<style scoped>
.timer-till-lose {
    margin:-10px 0 30px 20px;
    display:flex;
    height:fit-content;
    border-radius: 4px;
    padding:10px;
    font-size: 34px;
    color:rgb(0, 0, 0);
    cursor: default;
}

.ten-turns-left {
    background-color:rgb(255, 152, 17);
}
.five-turns-left {
    background-color:rgb(255, 131, 131);
}
.more-than-ten-turns-left {
    background-color: rgb(5, 200, 5);
}


@media only screen and (max-width: 600px) {
    .timer-till-lose {
        font-size: 24px;
    }
}
</style>


<script>
    export default {
        methods: {

        },
        props: {
            timer: {
                type: Number,
                required: true,
            }
        }
    }
</script>