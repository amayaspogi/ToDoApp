<template>
  <div>
    <div
      class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pb-2 mb-3 border-bottom"
    >
      <h1 class="h2 text-capitalize">Sign Up</h1>
    </div>
    <div class="row">
      <div class="mx-auto col-md-6 col-sm-12">
        <b-form class="form-signin" @submit.prevent="signup">
          <div class="row">
            <div class="col">
              <b-form-group label="First Name">
                <b-form-input
                  type="text"
                  class="form-control"
                  placeholder="First Name"
                  required
                  autofocus
                  autocomplete
                  v-model="firstName"
                />
              </b-form-group>
            </div>
          </div>
          <div class="row">
            <div class="col">
              <b-form-group label="Last Name">
                <b-form-input
                  type="text"
                  class="form-control"
                  placeholder="Last Name"
                  required
                  autocomplete
                  v-model="lastName"
                />
              </b-form-group>
            </div>
          </div>
          <div class="row">
            <div class="col">
              <b-form-group label="Email">
                <b-form-input
                  type="email"
                  class="form-control"
                  placeholder="Email"
                  required
                  autocomplete
                  v-model="email"
                />
              </b-form-group>
            </div>
          </div>
          <hr class="mb-4" />
          <b-button squared block variant="dark" type="submit">Sign-up</b-button>
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
        let body = {
          firstName: this.firstName,
          lastName: this.lastName,
          email: this.email,
        };
        let url = "ProfileService/SignUp";
        await this.$http.post(url, { body });
        this.$event.$emit(
          "info",
          "Signup Complete! Please check you're email address for verification."
        );
      } catch (ex) {
        this.$event.$emit("error", ex.message);
      }
    },
  },
  data() {
    return {
      firstName: "",
      lastName: "",
      email: "",
    };
  },
};
</script>
