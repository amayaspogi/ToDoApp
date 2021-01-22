<template>
<body>
  <navbar :data="navbar" :loaded="loaded" />
  <sidebar :data="sidebar" :loaded="loaded" />
  <div class="container-fluid">
    <div class="row">
      <sidebar />
      <main role="main" class="col-md-10 ml-sm-auto col-lg-10 pt-3 px-4">
        <slot />
      </main>
    </div>
  </div>
  <b-alert
    v-model="hasMessage"
    class="position-fixed fixed-bottom m-0 rounded-0 text-center"
    :variant="messageType"
    dismissible
  >{{ message }}</b-alert>
</body>
</template>

<script>
export default {
  watch: {
    $route: "clearError",
  },
  components: {
    navbar: () => import("../components/navbar/private"),
    sidebar: () => import("../components/sidebar/private"),
  },
  async created() {
    this.$event.$on("error", this.error);
    this.$event.$on("info", this.info);
    try {
      let url = "ProfileService/SignIn";
      let response = await this.$http.get(url);

      this.navbar.userType = response.type;
      this.navbar.email = response.email;
      this.navbar.initial = response.initial;
      this.navbar.name = response.name;

      this.sidebar.modules = response.modules;
      this.sidebar.userType = response.type;

      this.loaded = true;
    } catch (ex) {
      this.$event.$emit("error", ex.message);
    }
  },
  methods: {
    error(message) {
      this.notif("danger", message);
    },
    info(message) {
      this.notif("info", message);
    },
    notif(type, message) {
      this.message = message;
      this.hasMessage = !!this.message;
      this.messageType = type;
    },
    clearError() {
      this.error("");
    },
  },
  data() {
    return {
      message: "",
      hasMessage: false,
      messageType: "info",
      loaded: false,
      navbar: {
        userType: "",
        email: "",
        initial: "",
        name: "",
      },
      sidebar: {
        modules: [],
      },
    };
  },
};
</script>