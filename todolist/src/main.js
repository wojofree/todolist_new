import {createApp} from 'vue'
import ElementPlus from 'element-plus';
import App from './App.vue'
import "element-plus/dist/index.css";
import router from './router'
import store from './store'
import "/src/style/bootstrap.min.css"
import "/src/style/main.css"
import "bootstrap/dist/js/bootstrap.js"
// import draggable from 'vuedraggable'
import WaveSurferVue from "wavesurfer.js-vue";

createApp(App).use(store).use(router).use(ElementPlus).use(WaveSurferVue).mount('#app')



