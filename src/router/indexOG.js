import { createWebHistory, createRouter } from "vue-router";

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
  }
];

const router = createRouter({
  history: createWebHistory(), // Use createWebHistory to manipulate the browser's URL
  routes,
});

router.beforeEach((to, from, next) => {
  // they are logged in already
  if (localStorage.getItem("authToken") !== null){
    // if they have a chat uri already send to that chat room
    if(sessionStorage.getItem("uri") !== null){
      next(`/chats/${sessionStorage.getItem("uri")}`)
    }else{ //haven't started a chat & aren't joining a chat
      
    }
  }

  // if (localStorage.getItem("authToken") !== null || to.path === "/") {
  //   // console.log(to.fullPath)
  //   next();
  // } else {
  //   next("/");
  // }
});

export default router;
