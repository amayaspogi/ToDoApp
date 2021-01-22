import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";

function parseJwt(token) {
  try {
    var base64Url = token.split(".")[1];
    var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    var jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );

    return JSON.parse(jsonPayload);
  } catch {
    return {};
  }
}

// use vuex plugin
Vue.use(Vuex);
export const store = new Vuex.Store({
  state: {
    token: "",
    apiUrl: "",
  },
  mutations: {
    token(state, value) {
      state.token = value ?? "";
    },
    apiUrl(state, value) {
      state.apiUrl = value ?? "";
    },
  },
  getters: {
    authenticated(state) {
      let session = parseJwt(state.token);
      return !!session.userid;
    },
    token(state) {
      return state.token;
    },
    userId(state) {
      let session = parseJwt(state.token);
      return session["userid"];
    },
    type(state) {
      let session = parseJwt(state.token);
      return session["ch-type"];
    },
    apiUrl(state) {
      return state.apiUrl;
    },
  },
  plugins: [createPersistedState()],
});
