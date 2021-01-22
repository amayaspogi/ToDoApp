<template>
  <div>
    <div
      class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pb-2 mb-3 border-bottom"
    >
      <h1 class="h2 text-capitalize">Verify Sign-Up</h1>
    </div>
    <div class="row">
      <div class="col">
        <p class="lead">
          <em>Validate token using email address</em>
        </p>
      </div>
    </div>
    <div class="row">
      <div class="mx-auto col-md-6 col-sm-12">
        <b-form class="form-signin" @submit.prevent="signup">
          <div class="row">
            <div class="col">
              <b-form-group label="Email">
                <b-form-input
                  type="text"
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
          <b-button squared block variant="dark" type="submit">Verify Sign-up</b-button>
        </b-form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    async signup() {
      try {
        let url = "ProfileService/VerifySignUp";
        let body = {
          code: this.$route.query.token,
          email: this.email,
          password: this.password,
        };
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
