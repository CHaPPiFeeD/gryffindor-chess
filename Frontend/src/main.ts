import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import io from "socket.io-client";
const app = createApp(App);

app.config.globalProperties.$soketio = io("http://localhost:8000/");

app.use(store).use(router).mount("#app");
