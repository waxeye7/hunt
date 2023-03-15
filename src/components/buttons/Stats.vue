<script setup>
defineProps({
  timesWon: { //'Heading_Msg' is the variable name we to it in this example, and you can name it however you want
    type: Number, // String, Number, Array, Object, Boolean
    required: true
  }
});
</script>

<template>
    <div class="relative">
        <Transition>
            <div @click="revealModal=!revealModal" v-if="revealModal" class="modal">
                <p>Times won: {{ timesWon }}</p>
            </div>
        </Transition>

        <div  @click="revealModal=!revealModal" :class="{'border_radius_top':revealModal}" class="button">
            View Stats
        </div>
    </div>
</template>

<style scoped>
.button {
    cursor:pointer;
    margin:30px 0 0 0;
    display:flex;
    height:fit-content;
    border-radius: 4px;
    border:black 1px solid;
    padding:10px;
    font-size: 34px;
    color:rgb(0, 0, 0);
    background-color:rgb(212, 210, 210);
    z-index: 2;
}
.border_radius_top {
    border-radius: 0 0 4px 4px;
}
.modal {
    position:absolute;
    background-color:rgb(255, 255, 255);
    color:rgb(0, 0, 0);
    padding:22px 0;
    top:-116px;
    left:0;
    transform: translate(0, -50%);
    width:100%;
    height:400%;
    display:flex;
    flex-direction: column;
    align-items: center;
    border-radius:12px 12px 0 0;
    border-top:black 1px solid;
    border-left: black 1px solid;
    border-right: black 1px solid;
}
.modal p {
    padding:0 12px;
    font-size:20px;
}
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}

</style>

<script>
    export default {
        data() {
            return {
                revealModal:false
            }
        },
        methods:{

        }
    }
</script>
