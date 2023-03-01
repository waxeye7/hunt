<template>
    <div>
        <h1 style="color:white; margin-bottom: 10px;">water chance</h1>
        <input v-model="chance" @input="myChangeFunctionX()" class="input-board-dimensions" type="number" min="0" max="100" step="10" placeholder="X">
    </div>
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
    width:80px;
    cursor: default;
}
</style>


<script>
export default  {
    data() {
        return {
            chance:50
        }
    },

    methods:{
        myChangeFunctionX() {
            this.$emit('waterChanceChange', this.chance)
        },
    },

}

</script>