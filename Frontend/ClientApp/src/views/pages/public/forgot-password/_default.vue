<template>
  <div>
    <div
      class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pb-2 mb-3 border-bottom"
    >
      <h1 class="h2 text-capitalize">Forgot Password</h1>
    </div>
    <div class="row">
      <div class="mx-auto col-md-6 col-sm-12">
        <b-form class="form-signin" @submit.prevent="forgotpassword">
          <div class="row">
            <div class="col">
              <b-form-group label="Email">
                <b-form-input
                  type="email"
                  class="form-control"
                  placeholder="Email "
                  required
                  autofocus
                  autocomplete
                  v-model="email"
                />
              </b-form-group>
            </div>
          </div>
          <hr class="mb-4" />
          <b-button squared block variant="dark" type="submit">Forgot Password</b-button>
        </b-form>
        <div class="mt-3" :hidden="!returnUrl">
          <b-link :href="returnUrl" class="text-muted">Click here to verify Forgot Password</b-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    async forgotpassword() {
      try {
        let body = { email: this.email };
        let url = "ProfileService/ForgotPassword";
        let response = await this.$http.post(url, { body });
        this.returnUrl = `/forgot-password-complete?token=${response.code}`;
      } catch (ex) {
        this.$event.$emit("error", ex.message);
      }
    },
  },
  data() {
    return {
      email: "",
      password: "",
      returnUrl: "",
    };
  },
};
</script>
