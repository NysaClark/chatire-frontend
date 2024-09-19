import { createMemoryHistory, createRouter } from "vue-router";

import Chat from "@/components/Chat";
import UserAuth from "@/components/UserAuth";

const routes = [
  {
    path: "/chats",
    component: Chat,
  },
  {
    path: "/auth",
    component: UserAuth,
  },
];

const router = createRouter({
  history: createMemoryHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  console.log("here");
  if (sessionStorage.getItem("authToken") !== null || to.path === "/auth") {
    next();
  } else {
    next("/auth");
  }
});

export default router;
