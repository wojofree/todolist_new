import { createApp } from 'vue'
import ElementPlus from 'element-plus';
import App from './App.vue'
import "element-plus/dist/index.css";
import router from './router'
import store from './store'
import "bootstrap/dist/css/bootstrap.min.css"
import axios from "axios";

createApp(App).use(store).use(router).use(ElementPlus).mount('#app')

import "bootstrap/dist/js/bootstrap.js"

axios.defaults.withCredentials = true
