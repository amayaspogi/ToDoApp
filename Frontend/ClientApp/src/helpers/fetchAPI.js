import { router } from "./router.js";
import { store } from "./store.js";

export const fetchAPI = {
  get: async (url, options) => await fetchAPI.request(url, "GET", options),
  post: async (url, options) => await fetchAPI.request(url, "POST", options),
  patch: async (url, options) => await fetchAPI.request(url, "PATCH", options),
  request: async function (url, method, options) {
    let { body, query } = options ?? {};
    let token = store.getters.token;

    // setup headers
    let headers = new Headers();
    headers.append("Accept", "application/json");
    headers.append("Content-Type", "application/json");
    if (token) headers.append("Authorization", `Bearer ${token}`);

    // clean object
    query = query ?? {};
    Object.keys(query).forEach((x) => {
      if (query[x] == null || query[x] == "") {
        delete query[x];
      }
    });

    // setup url query
    let baseUrl = process.env.VUE_APP_ApiUrl;
    baseUrl = baseUrl ? baseUrl : store.getters.apiUrl;
    let requestUrl = new URL(`${baseUrl}/${url}`);
    requestUrl.search = `${new URLSearchParams(query)}`;

    // setup request
    let params = { method, headers };
    if (body) params.body = JSON.stringify(body);

    let response = await fetch(requestUrl, params);
    if (response.ok) {
      return await response.json();
    } else if (response.status == 401) {
      store.commit("token", "");
      let route = router.app.$route;
      let query = { redirectTo: route.fullPath.substring(1) };
      if (!query.redirectTo) query = null;
      router.push({ name: "login", query: query });
    } else if (response.status == 400) {
      let error = await response.text();
      throw new Error(JSON.parse(error).message);
    } else {
      throw new Error("Unhandled error");
    }
  },
};
