// import './assets/main.css'

import {createApp} from 'vue'
import {createPinia} from 'pinia'

import axios from "axios";

import App from './App.vue'
import router from './router/index'


const app = createApp(App)

app.use(createPinia())
app.use(router)

let api_base = "http://127.0.0.1:8080/api";
app.provide('global', {
    api_base,
    axios
})

app.mount('#app')
