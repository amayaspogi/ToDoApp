<template>
  <b-navbar variant="dark" class="sticky-top flex-md-nowrap">
    <b-navbar-nav class="mx-auto text-center">
      <b-nav-item v-for="item in data.links" :key="item.name">
        <router-link v-bind:to="item.path" class="nav-link p-0 text-light">{{ item.text }}</router-link>
      </b-nav-item>
    </b-navbar-nav>
    <b-navbar-nav class="flex-row justify-content-center flex-nowrap">
      <b-nav-item>
        <router-link
          :to="{ path: '/signup' }"
          tag="button"
          class="btn btn-sm btn-outline-secondary rounded-0 text-light"
          squared
        >SIGN-UP</router-link>
        <router-link
          :to="{ path: '/signin' }"
          tag="button"
          class="btn btn-sm btn-secondary rounded-0"
          squared
        >SIGN-IN</router-link>
      </b-nav-item>
    </b-navbar-nav>
  </b-navbar>
</template>


<script>
export default {
  props: {
    data: {
      links: Array,
    },
  },
};
</script>