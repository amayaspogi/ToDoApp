<template>
  <component :is="component">
    <router-view />
  </component>
</template>

<script>
export default {
  computed: {
    component() {
      return this.$store.getters.authenticated ? "private" : "public";
    },
  },
};
</script>

<style>
html,
body {
  height: 100%;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
