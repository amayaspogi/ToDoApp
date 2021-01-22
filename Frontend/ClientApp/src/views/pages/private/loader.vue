<template>
  <component :is="component" @back="$parent.back" v-if="component" />
</template>

<script>
export default {
  watch: {
    path: "load",
  },
  props: {
    path: String,
  },
  mounted() {
    this.load();
  },
  methods: {
    load() {
      this.component = () => import(`${this.path}`);
    },
  },
  data() {
    return {
      component: {},
    };
  },
};
</script>