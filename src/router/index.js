import { createRouter, createMemoryHistory } from 'vue-router';

import UserAuth from "@/components/UserAuth";  // A single page for login/signup
import Chat from "@/components/Chat-ChatGPT";

const routes = [
  {
    path: "/auth",
    name: "UserAuth",
    component: UserAuth,
    beforeEnter: (to, from, next) => {
      // If the user is already logged in, redirect to the chat page
      if(localStorage.getItem("authToken") !== null){
        next("/chats/");
      }else{
        next();
      }
    }
  },
  {
    path: "/chats/:uri?",
    name: 'Chat',
    component: Chat,
    meta: {requiresAuth: true}, // Custom meta field to check for auth
  },
  {
    path: '/:pathMatch(.*)*',  // Catch-all for unknown routes
    redirect: '/auth', 
  },
];


const router = createRouter({
  history: createMemoryHistory(),
  routes,
});

// Global navigation guard to check for protected routes
router.beforeEach((to, from, next) => {
  console.log('Route object:', to); // This will show the entire route object
  console.log('Route params:', to.params); // Check if the params object contains the expected values
  console.log('Navigating to:', to.path); // Print the target path for navigation

  if(to.matched.some(record => record.meta.requiresAuth)){
    // This route requires authentication
    if(localStorage.getItem("authToken") == null){
      // User is not logged in, redirect to auth page
      next("/auth");
    }else{
      // User is authenticated, proceed
      next();
    }
  } else {
    // This route does not require authentication
    next();
  }
});

export default router;
