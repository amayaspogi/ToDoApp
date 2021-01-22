import Vue from "vue";
import VueRouter from "vue-router";
import { store } from "./store.js";

Vue.use(VueRouter);
Vue.component("private", () => import("../views/layouts/private"));
Vue.component("public", () => import("../views/layouts/public"));

const patternMatch = {
  userTypes: "backoffice|studio|service|client",
  productTypes: "products|packages|product-packages",
  id: "[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}",
};

export const router = new VueRouter({
  mode: "history",
  routes: [
    {
      path: "/",
      beforeEnter(to, from, next) {
        let authenticated = store.getters.authenticated;
        if (authenticated) {
          next({ path: "/dashboard" });
        } else {
          next({ path: "/home" });
        }
      },
    },
    {
      path: "/home",
      component: () => import("../views/pages/shared/home"),
    },
    {
      path: "/about",
      component: () => import("../views/pages/shared/about"),
    },
    {
      path: "/services",
      component: () => import("../views/pages/shared/services"),
    },
    {
      path: "/team",
      component: () => import("../views/pages/shared/team"),
    },
    {
      path: "/contact",
      component: () => import("../views/pages/shared/contact"),
    },
    {
      path: "/contact",
      component: () => import("../views/pages/shared/contact"),
    },
    {
      path: "/signin",
      component: () => import("../views/pages/public/signin"),
      meta: { type: "public", redirectTo: "dashboard" },
    },
    {
      path: "/signup",
      component: () => import("../views/pages/public/signup/_default"),
      meta: { type: "public" },
    },
    {
      path: "/signup-complete",
      component: () => import("../views/pages/public/signup/complete"),
      meta: { type: "public", redirectTo: "dashboard" },
    },
    {
      path: "/forgot-password",
      component: () => import("../views/pages/public/forgot-password/_default"),
      meta: { type: "public" },
    },
    {
      path: "/forgot-password-complete",
      component: () => import("../views/pages/public/forgot-password/complete"),
      meta: { type: "public", redirectTo: "dashboard" },
    },
    {
      path: "/dashboard",
      component: () => import("../views/pages/private/dashboard/_default"),
      meta: { type: "private" },
    },
    {
      path: `/:type(${patternMatch.userTypes})-user`,
      component: () =>
        import("../views/pages/private/user-management/_default"),
      meta: { type: "private" },
      children: [
        {
          path: `/:type(${patternMatch.userTypes})-user`,
          components: {
            grid: () =>
              import("../views/pages/private/user-management/components/grid"),
          },
          meta: { type: "private" },
        },
        {
          path: `/:type(${patternMatch.userTypes})-user/:id(${patternMatch.id}|current|new)`,
          components: {
            details: () =>
              import(
                "../views/pages/private/user-management/components/details"
              ),
          },
          meta: { type: "private" },
        },
      ],
    },
    {
      path: "/products",
      component: () => import("../views/pages/private/products/_default"),
      meta: { type: "private" },
      children: [
        {
          path: `/:type(${patternMatch.productTypes})`,
          meta: { type: "private" },
          components: {
            grid: () => import("../views/pages/private/loader"),
          },
        },
        {
          path: `/:type(${patternMatch.productTypes})/:id(${patternMatch.id}|new)`,
          meta: { type: "private" },
          components: {
            details: () => import("../views/pages/private/loader"),
          },
        },
      ],
    },
    {
      path: "/segments",
      component: () => import("../views/pages/private/segments/_default"),
      meta: { type: "private" },
      children: [
        {
          path: `/:type(segments)`,
          meta: { type: "private" },
          components: {
            grid: () => import("../views/pages/private/loader"),
          },
        },
        {
          path: `/:type(segments)/:id(${patternMatch.id}|new)`,
          meta: { type: "private" },
          components: {
            details: () => import("../views/pages/private/loader"),
          },
        },
      ],
    },
    {
      path: "*",
      component: () => import("../views/pages/shared/not-found"),
    },
  ],
});

router.beforeEach((to, from, next) => {
  let authenticated = store.getters.authenticated;
  let routeType = to.meta.type ?? "shared";

  if (!authenticated && routeType == "private") {
    let query = { redirectTo: to.fullPath.substring(1) };
    if (!query.redirectTo) query = null;
    next({ path: "/signin", query: query });
  } else if (authenticated && routeType == "public") {
    next({ path: "/" });
  } else {
    next();
  }
});
