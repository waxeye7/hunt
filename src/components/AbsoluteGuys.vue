<template>
    <img class="survivor absolute" src="../assets/survivor.gif">
    <img class="hunter absolute" src="../assets/hunt.webp">
    <img class="survivor2 absolute" src="../assets/survivor.gif">
    <img class="hunter2 absolute" src="../assets/hunt.webp">
</template>

<style scoped>
.hunter {
    width:80px;
    height:80px;
    left:v-bind(hunterPositionLeft);
    top:v-bind(hunterPositionTop);
}
.hunter2 {
    width:80px;
    height:80px;
    right:v-bind(hunterPositionRight2);
    top:v-bind(hunterPositionTop2);
}
.survivor {
    width:80px;
    height:80px;
    right:v-bind(survivorPositionRight);
    top:v-bind(survivorPositionTop);
}
.survivor2 {
    width:80px;
    height:80px;
    left:v-bind(survivorPositionLeft2);
    top:v-bind(survivorPositionTop2);
}
</style>

<script>
export default {
    data() {
            return {
                hunterPositionLeft:Math.floor(Math.random() * Math.floor(window.innerWidth / 2.5 - 150)).toString() + "px",
                hunterPositionTop:Math.floor(Math.random() * Math.floor(window.innerHeight - 200)).toString() + "px",

                hunterPositionRight2:Math.floor(Math.random() * Math.floor(window.innerWidth / 2.5 - 150)).toString() + "px",
                hunterPositionTop2:Math.floor(Math.random() * Math.floor(window.innerHeight - 200)).toString() + "px",

                survivorPositionRight:Math.floor(Math.random() * Math.floor(window.innerWidth / 2.5 - 150)).toString() + "px",
                survivorPositionTop:Math.floor(Math.random() * Math.floor(window.innerHeight - 200)).toString() + "px",

                survivorPositionLeft2:Math.floor(Math.random() * Math.floor(window.innerWidth / 2.5 - 150)).toString() + "px",
                survivorPositionTop2:Math.floor(Math.random() * Math.floor(window.innerHeight - 200)).toString() + "px",
            }
        },
}
</script>