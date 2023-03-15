<script setup>
import 'animate.css';
</script>

<template>
    <img @click="clicked1=!clicked1" :class="{'animate__rotateOut':clicked1}" class="survivor absolute animate__animated" src="../../assets/survivor.gif">
    <img @click="clicked2=!clicked2" :class="{'animate__rotateOut':clicked2}" class="hunter absolute animate__animated" src="../../assets/hunt.webp">
    <img @click="clicked3=!clicked3" :class="{'animate__rotateOut':clicked3}" class="survivor2 absolute animate__animated" src="../../assets/survivor.gif">
    <img @click="clicked4=!clicked4" :class="{'animate__rotateOut':clicked4}" class="hunter2 absolute animate__animated" src="../../assets/hunt.webp">
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
                clicked1:false,
                clicked2:false,
                clicked3:false,
                clicked4:false,

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