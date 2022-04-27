import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import VueSocketIO from "vue-3-socket.io";
import SocketIO from "socket.io-client";
const options = { path: "/search/room/" };

createApp(App)
  .use(store)
  .use(
    new VueSocketIO({
      debug: true,
      connection: SocketIO("http://localhost:8000", options), //options object is Optional
      vuex: {
        store,
        actionPrefix: "SOCKET_",
        mutationPrefix: "SOCKET_",
      },
    })
  )
  .use(router)
  .mount("#app");
