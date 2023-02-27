<script setup>
import AbsoluteGuys from "../components/AbsoluteGuys.vue";
</script>

<template>
    <div class="container relative">
        <AbsoluteGuys />
        <div class="txt-block">
            <h1>Choose</h1>
            <h1>Create or Join</h1>
        </div>
        <div class="flex flex-col links">
            <router-link to="/multiplayer/create" class="link-style">Create Game</router-link>
            <router-link to="/multiplayer/join" class="link-style">Join Game</router-link>
        </div>

        <div class="players-online">
            <h1>87 Players Online</h1>
        </div>
    </div>
</template>

<style scoped>
.players-online {
    position:absolute;
    left:50%;
    transform: translate(-50%, 0);
    top:64%;
    text-align: center;
    font-size: clamp(14px, 2vw, 16px);
    width:100vw;
}
.txt-block {
    font-size: clamp(16px, 2vw,20px);
    position:absolute;
    top:20%;
    left:50%;
    transform: translate(-50%, 0);
    text-align: center;
    width:100vw;
}
.container {
    height:calc(100vh - 46px);
    background-color:white !important;
    display: flex;
    flex-direction: column;
    justify-content: center;
}
.links {
    justify-content: center;
    align-items: center;
    padding-bottom:100px ;
}
.link-style {
    text-decoration: none;
    margin-top:20px;
    padding:30px;
    background-color: rgb(46, 46, 46);
    color:white;
    font-size: 26px;
    width:200px;
    text-align: center;
    box-shadow: rgba(50, 50, 93, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px;

}
.link-style:hover {
    background-color: rgb(0, 0, 0);
    box-shadow: rgba(50, 50, 93, 0.356) 0px 23px 47px -10px, rgba(0, 0, 0, 0.449) 0px 16px 22px -14px;

}
</style>

<script>
    export default {
        
    }
</script>
