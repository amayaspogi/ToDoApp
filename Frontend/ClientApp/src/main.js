import App from "./app";
import Vue from "vue";
import { BootstrapVue, BootstrapVueIcons } from "bootstrap-vue";

// helpers
import { router } from "./helpers/router.js";
import { store } from "./helpers/store.js";
import { fetchAPI } from "./helpers/fetchAPI.js";

// css
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-vue/dist/bootstrap-vue.css";

// loda env.json
(async () => {
  let response = await fetch("/env.json");
  let apiUrl = "";
  if (response.ok) {
    let env = await response.json();
    apiUrl = env.apiUrl;
  }
  store.commit("apiUrl", apiUrl);
})();

// dependency injection
Vue.use(BootstrapVue);
Vue.use(BootstrapVueIcons);
Vue.prototype.$http = fetchAPI;
Vue.prototype.$event = new Vue();
Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
