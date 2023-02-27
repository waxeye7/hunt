<script setup>
import randomWords from "random-words";
</script>
<template>
    <nav class="flex">
        <router-link to="/" class="link-style center-vertical flex align-center">
            <img class="nav-img" src="../assets/survivor.gif">
            <h1>Hunting Game</h1>
        </router-link>

        <h1 class="margin-left-auto center-vertical padding-right-10">Logged in as: <span>{{ user }}</span></h1>

    </nav>
</template>

<style scoped>

.nav-img {
    height:24px;
    width:30px;
    margin-right:4px;
    margin-bottom:5px;
}
.link-style {
    color:black;
    text-decoration: none;
}
nav {
    width:100%;
    height:46px;
    background-color:rgb(230, 137, 255);
    cursor:default;
    font-size: clamp(10px, 2.4vw, 16px);
}
.center-vertical {
    margin:auto 0;
}
nav .link-style{
    padding:0 10px;
}
.margin-left-auto {
    margin-left: auto;
}
.padding-right-10 {
    padding-right: 10px;
}
span {
    color:red
}
</style>

<script>
    export default {
        data() {
            return {
                user:randomWords({min:2, max:3}).join("-")
            }
        }
    }
</script>
