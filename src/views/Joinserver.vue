<script setup>
import AbsoluteGuys from "../components/AbsoluteGuys.vue";
</script>

<template>
    <div class="container flex flex-col center relative">
        <AbsoluteGuys />
        <p>enter ip address to connect</p>
        <div class="flex">
            <input v-bind="ip_address" type="text">
            <div class="go">Go</div>
        </div>
        <h1>{{ ip_address }}</h1>
        
    </div>
</template>

<style scoped>
.go {
    margin-left:10px;
    padding:4px;
    color:rgb(0, 0, 0);
    cursor: pointer;
}
p{
    margin-bottom:8px;
}
.container {
    height:calc(100vh - 46px);
    background-color:white !important;
}
.center {
    justify-content: center;
    align-items: center;
}
</style>

<script>
    export default {
        data() {
            return {
                ip_address:""
            }
        }
    }
</script>
