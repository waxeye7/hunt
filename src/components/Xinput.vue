<template>
    <input v-model="x" @input="myChangeFunctionX()" class="input-board-dimensions" type="number" min="1" max="9" placeholder="X">
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


<script>
export default  {
    data() {
        return {
            x:5
        }
    },

    methods:{
        myChangeFunctionX() {
            this.$emit('inputted', this.x)
        },
    },

}

</script>