<template>
  <div>
    <div
      class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pb-2 mb-3 border-bottom"
    >
      <h1 class="h2 text-capitalize">Sign In</h1>
    </div>
    <div class="row">
      <div class="mx-auto col-md-6 col-sm-12">
        <b-form class="form-signin" @submit.prevent="login">
          <div class="row">
            <div class="col">
              <b-form-group label="Email">
                <b-form-input
                  type="email"
                  class="form-control"
                  placeholder="Email"
                  required
                  autofocus
                  autocomplete
                  v-model="email"
                />
              </b-form-group>
            </div>
          </div>
          <div class="row">
            <div class="col">
              <b-form-group label="Password">
                <b-form-input
                  type="password"
                  class="form-control"
                  placeholder="Password"
                  required
                  autocomplete
                  v-model="password"
                />
              </b-form-group>
            </div>
          </div>
          <hr class="mb-4" />
          <b-button squared block variant="dark" type="submit">Sign-In</b-button>
          <router-link
            :to="{ path: '/forgot-password' }"
            tag="button"
            class="btn btn-secondary btn-block rounded-0"
            squared
            variant="info"
          >Forgot Password</router-link>
        </b-form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    async login() {
      try {
        let url = "ProfileService/SignIn";
        let body = { email: this.email, password: this.password };
        let response = await this.$http.post(url, { body });

        this.$store.commit("token", response.token);

        // get redirectTo
        let metaRedirect = this.$route.meta.redirectTo;
        this.$router.push(`/${this.$route.query?.redirectTo ?? metaRedirect}`);
      } catch (ex) {
        this.$event.$emit("error", ex.message);
      }
    },
  },
  data() {
    return {
      email: "",
      password: "",
    };
  },
};
</script>
