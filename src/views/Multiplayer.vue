<template>
    <div class="container">
        <div class="center">
            <h1>Multiplayer</h1>
            <h1></h1>
        </div>
        <div class="flex flex-col links">
            <router-link to="/multiplayer/create" class="link-style">Create Game</router-link>
            <router-link to="/multiplayer/join" class="link-style">Join Game</router-link>
        </div>

    </div>
</template>

<style scoped>
.center {
    padding-top: 10px;
    margin:0 auto;
    text-align: center;
}
.container {
    height:calc(100vh - 46px);
    background-color:white !important;
}
.links {
    justify-content: center;
    align-items: center;
}
.link-style {
    text-decoration: none;
    margin-top:20px;
    padding:30px;
    background-color: rgb(46, 46, 46);
    color:white;
    font-size: 30px;
    width:200px;
    text-align: center;
}
.link-style:hover {
    background-color: rgb(0, 0, 0);
}
</style>

<script>
    export default {
        
    }
</script>
