<template>
  <b-navbar variant="dark" class="sticky-top flex-md-nowrap p-0">
    <b-navbar-nav>
      <b-button v-b-toggle.module-sidebar>CH</b-button>
    </b-navbar-nav>
    <b-navbar-nav class="ml-auto" v-if="loaded" variant="light">
      <b-nav-item-dropdown right no-caret>
        <template slot="button-content">
          <b-avatar>
            {{ data.initial }}
          </b-avatar>          
        </template>
        <b-dropdown-item href="#">
          <div>
            <h6>{{ data.name }}</h6>
            <small>{{ data.email }}</small>
            <p style="margin-top:20px;">
              <router-link :to="{ path: edit }">edit</router-link>
            </p>
            <p style="margin-top:20px;">
              <b-button class="w-100" @click="signout">Sign-out</b-button>
            </p>
          </div>
        </b-dropdown-item>
      </b-nav-item-dropdown>
    </b-navbar-nav>
  </b-navbar>
</template>

<script>
export default {
  props: {
    loaded: Boolean,
    data: {
      userType: String,
      email: String,
      initial: String,
      name: String,
    },
  },
  methods: {
    signout() {
      this.$store.commit("token", "");
      this.$router.push("/home");
    },
  },
  computed: {
    edit() {
      return `/${this.data.userType}-user/current`;
    },
  },
};
</script>