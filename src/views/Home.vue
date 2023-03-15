<script setup>
import AbsoluteGuys from "../components/silly/AbsoluteGuys.vue";

</script>

<template>
    <div class="container relative">
        <h4>pageviews: {{ pageviews_count }}</h4>
        <h4>visits: {{ visits_count }}</h4>
        <AbsoluteGuys />
        <div class="txt-block">
            <h1>Welcome To</h1>
            <h1>The Hunting Game!</h1>

        </div>
        <div class="links flex flex-col">
            <router-link to="/singleplayer" class="link-style">Singleplayer</router-link>
            <router-link to="/multiplayer" class="link-style">Multiplayer</router-link>
        </div>

        <div class="players-online">
            <h1>87 Players Online</h1>
        </div>
    </div>
</template>


<script>
    export default {
        data() {
            return {
                pageviews_count:null,
                visits_count:null
            }
        },
        computed: {

        },
        methods: {
            updateCounter(type) {
                fetch('http://127.0.0.1:3002/api?'+type)
                .then(res => res.json())
                .then(data => {
                    this.pageviews_count = data.pageviews;
                    this.visits_count = data.visits;
                })
            }
        },
        created() {

            if(sessionStorage.getItem('visit') === null) {
                this.updateCounter('type=visit-pageview');
            }
            else {
                this.updateCounter('type=pageview');
            }
           
            sessionStorage.setItem('visit', 'x');
            
        }
    }
</script>



<style scoped>
.players-online {
    position:absolute;
    left:50%;
    transform: translate(-50%, 0);
    top:64%;
    text-align: center;
    font-size: clamp(14px, 2vw, 16px);
    width:fit-content;
}
.txt-block {
    font-size: clamp(16px, 2vw,20px);
    position:absolute;
    top:20%;
    left:50%;
    transform: translate(-50%, 0);
    text-align: center;
    width:fit-content;
}
.container {
    height:calc(100vh - 46px);
    background-color:rgba(86, 255, 71, 0.815) !important;
    display: flex;
    flex-direction: column;
    justify-content: center;
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
.links {
    justify-content: center;
    align-items: center;
    padding-bottom: 100px;
}
</style>