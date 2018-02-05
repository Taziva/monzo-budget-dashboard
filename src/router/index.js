import Vue from "vue";
import Router from "vue-router";
import firebase from "firebase";

import Home from "@/components/Home";
import Account from "@/components/Account";
import Authorize from "@/components/Authorize";
import Login from "@/components/Login";
import SignUp from "@/components/SignUp";

Vue.use(Router);

let router = new Router({
  mode: "history",
  routes: [
    {
      path: "*",
      redirect: "/"
    },
    {
      path: "/",
      name: "Home",
      component: Home,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: "/account",
      name: "Account",
      component: Account,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: "/authorize",
      name: "Authorize",
      component: Authorize,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: "/login",
      name: "Login",
      component: Login
    },
    {
      path: "/sign-up",
      name: "Sign Up",
      component: SignUp
    }
  ]
});

router.beforeEach((to, from, next) => {
  let currentUser = firebase.auth().currentUser;
  let requiresAuth = to.matched.some(record => record.meta.requiresAuth);

  if (requiresAuth && !currentUser) next("login");
  else if (!requiresAuth && currentUser) next("hello");
  else next();
});

export default router;
