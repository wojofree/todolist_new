import { createApp } from 'vue'
import ElementPlus from 'element-plus';
import App from './App.vue'
import "element-plus/dist/index.css";
import router from './router'
import store from './store'
import "/src/style/bootstrap.min.css"
import "bootstrap/dist/js/bootstrap.js"
// import draggable from 'vuedraggable'

createApp(App).use(store).use(router).use(ElementPlus).mount('#app')



