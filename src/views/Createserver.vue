<template>
    <div class="container center flex flex-col">
        <div class="flex flex-col center">
            <h1 class="margin-bottom-much">your address: <span>{{ address }}</span></h1>
            <h1 class="margin-bottom-tiny">Waiting for Opponent to join...</h1>
            <img src="../assets/mr-bean-waiting.gif" alt="">
            <div class="much-padding-bottom"></div>
        </div>

    </div>
</template>

<style scoped>
.much-padding-bottom {
    padding-bottom: 76px;
}
.margin-bottom-much {
    margin-bottom: 80px;
}
.padding-top26percent {
    padding-top:26%;
}
.margin-bottom-tiny{
    margin-bottom:10px;
}
.container {
    height:calc(100vh - 46px);
    background-color:white !important;
}
.center {
    justify-content: center;
    align-items: center;
}
span{
    color:red;
}
</style>

<script>
    export default {
        data() {
            return {
                address:"192.158.1.38"
            }
        }
    }
</script>
