import { createMemoryHistory, createRouter } from "vue-router";

import Chat from "@/components/Chat";
import UserAuth from "@/components/UserAuth";

const routes = [
  {
    path: "/",
    component: UserAuth,
  },
  {
    path: "/chats/:uri?",
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
  // console.log(localStorage.getItem("authToken"))
  if (localStorage.getItem("authToken") !== null || to.path === "/auth") {
    next();
  } else {
    next("/auth");
  }
});

export default router;
