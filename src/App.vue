<script setup>
import TitleComponent from "./components/Title.vue";
// import BoardComponent from "./components/Board.vue";
import BoardComponent from "./components/Board.vue";
</script>
<template>
  <div class="flex flex-col">
    <router-link to="/">Go to Home</router-link>
    <router-link to="/about">Go to About</router-link>
  </div>


  <router-view></router-view>

  <TitleComponent />
  <BoardComponent />
</template>
<style scoped></style>