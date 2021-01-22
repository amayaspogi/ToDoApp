<template>
  <div>
    <div
      class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pb-2 mb-3 border-bottom"
    >
      <h1 class="h2 text-capitalize">{{ title }}</h1>
      <div class="btn-toolbar mb-2 mb-md-0" v-if="!isCurrent">
        <div class="btn-group mr-2" v-if="!!userId">
          <input
            class="btn btn-sm btn-outline-secondary"
            type="button"
            @click="back"
            value="Back"
          />
        </div>
        <div class="btn-group mr-2" v-else>
          <input
            class="btn btn-sm btn-outline-secondary"
            type="button"
            @click="add"
            value="Add User"
          />
        </div>
      </div>
    </div>
    <router-view name="grid" />
    <router-view name="details" @back="back" />
  </div>
</template>

<script>
export default {
  computed: {
    userType() {
      return this.$route.params.type;
    },
    userId() {
      return this.$route.params.id;
    },
    title() {
      if (this.isCurrent) {
        return "User Profile";
      } else {
        return `${this.userType} User Management`;
      }
    },
    isCurrent() {
      return this.userId == "current";
    },
  },
  methods: {
    add() {
      let url = `/${this.userType}-user/new`;
      this.$router.push({ path: url });
    },
    back() {
      let url = `/${this.userType}-user`;
      this.$router.push({ path: url });
    },
  },
};
</script>
