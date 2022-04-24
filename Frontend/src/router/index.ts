import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import MainPage from "../components/MainPage.vue";
import ChessPage from "../components/ChessPage.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    component: MainPage,
  },
  {
    path: "/chessway",
    component: ChessPage,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
