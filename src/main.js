import { createApp } from 'vue'
import App from './App.vue'
import 'D:\\桌面\\todo-aio-master\\node_modules\\element-plus\\theme-chalk\\index.css';
import './assets/main.css'
import ElementPlus from 'element-plus';

const app = createApp(App)
app.use(ElementPlus)

createApp(App).mount('#app')
