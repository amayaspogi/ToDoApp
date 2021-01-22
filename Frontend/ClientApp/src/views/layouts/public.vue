<template>
<body>
  <navbar :data="navbar" />
  <div class="container-fluid">
    <div class="row">
      <main role="main" class="mx-sm-auto col-sm-12 col-md-10 col-lg-9 pt-3 px-4">
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
    navbar: () => import("../components/navbar/public"),
  },
  created() {
    this.$event.$on("error", this.error);
    this.$event.$on("info", this.info);
    this.navbar.links.push({ path: "/home", text: "Home" });
    this.navbar.links.push({ path: "/about", text: "About" });
    this.navbar.links.push({ path: "/services", text: "Services" });
    this.navbar.links.push({ path: "/team", text: "Team" });
    this.navbar.links.push({ path: "/contact", text: "Contact" });
    this.loaded = true;
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
        links: [],
      },
    };
  },
};
</script>
