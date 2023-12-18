// import './assets/main.css'

import {createApp} from 'vue'
import {createPinia} from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

import axios from "axios";

import App from './App.vue'
import router from './router/index'


const app = createApp(App)

app.use(createPinia().use(piniaPluginPersistedstate))
app.use(router)

let api_base = "http://127.0.0.1:8000";
app.provide('global', {
    api_base,
    axios
})

app.mount('#app')
