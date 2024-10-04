import { createRouter, createWebHistory } from "vue-router";

import UserAuth from "@/components/UserAuth"; // A single page for login/signup
import Chat from "@/components/Chat";

const routes = [
  {
    path: "/auth",
    name: "UserAuth",
    component: UserAuth,
    beforeEnter: (to, from, next) => {
      // If the user is already logged in, redirect to the chat page
      if (
        localStorage.getItem("authToken") !== null &&
        localStorage.getItem("authToken") !== "null" &&
        localStorage.getItem("authToken") !== undefined
      ) {
        next("/chats/");
      } else {
        next();
      }
    },
  },
  {
    path: "/chats/:uri?",
    name: "Chat",
    component: Chat,
    meta: { requiresAuth: true }, // Custom meta field to check for auth
  },
  {
    path: "/:pathMatch(.*)*", // Catch-all for unknown routes
    redirect: "/auth",
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Global navigation guard to check for protected routes
router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    // This route requires authentication
    // console.log(localStorage.getItem("authToken"))
    if (
      localStorage.getItem("authToken") == null ||
      localStorage.getItem("authToken") == "null" ||
      localStorage.getItem("authToken") == undefined
    ) {
      // User is not logged in, redirect to auth page
      next("/auth");
    } else {
      // User is authenticated, proceed
      next();
    }
  } else {
    // This route does not require authentication
    next();
  }
});

export default router;
