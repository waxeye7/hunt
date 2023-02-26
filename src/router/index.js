import { createRouter, createWebHistory } from "vue-router";

import Home from "../views/Home.vue";
import Singleplayer from "../views/Singleplayer.vue";
import Multiplayer from "../views/Multiplayer.vue";
import Createserver from "../views/Createserver.vue";
import Joinserver from "../views/Joinserver.vue";

const routes = [
    {
        path:'/',
        name:'Home',
        component: Home
    },
    {
        path:'/singleplayer',
        name:'Singleplayer',
        component: Singleplayer
    },
    {
        path:'/multiplayer',
        name:'Multiplayer',
        component: Multiplayer
    },
    {
        path:'/multiplayer/create',
        name:'Create',
        component: Createserver
    },
    {
        path:'/multiplayer/join',
        name:'Join',
        component: Joinserver
    }
];

const router = createRouter({
    history:createWebHistory(),
    routes
})

export default router;