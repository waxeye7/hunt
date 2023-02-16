<template>
    <p class="start-game-button" 
        v-bind="$attrs">
        Start Game
    </p>
</template>

<style scoped>
.start-game-button {
    margin:-10px 20px 30px 0;
    color:rgb(0, 0, 0);
    background-color:rgb(212, 210, 210);
    font-size: 34px;
    font-weight:500;
    height:fit-content;
    border-radius: 4px;
    padding:10px;
    cursor: pointer;
}
@media only screen and (max-width: 600px) {
    .start-game-button {
        font-size: 24px;
    }
}
</style>


<script>

</script>