<template>
    <input v-model="y" @input="myChangeFunctionY()" class="input-board-dimensions" type="number" min="3" max="9" placeholder="Y">
</template>

<style scoped>
.input-board-dimensions {
    margin:-10px 0 30px 40px;
    color:rgb(0, 0, 0);
    background-color:rgb(212, 210, 210);
    font-size: 34px;
    font-weight:500;
    height:fit-content;
    border-radius: 4px;
    padding:10px;
    width:70px;
    cursor: default;
}
</style>


<script lang="ts">
export default  {
    data() {
        return {
            y:5
        }
    },

    methods:{
        myChangeFunctionY() {
            this.$emit('inputted', this.y)
        },
    },

}

</script>