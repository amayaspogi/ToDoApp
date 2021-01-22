<template>
  <div>
    <div
      class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pb-2 mb-3 border-bottom"
    >
      <h1 class="h2 text-capitalize">{{ type.replace("-", " ") }} Management</h1>
      <div class="btn-toolbar mb-2 mb-md-0">
        <div class="btn-group mr-2" v-if="!!id">
          <input class="btn btn-sm btn-outline-secondary" type="button" @click="back" value="Back" />
        </div>
        <div class="btn-group mr-2" v-else>
          <input
            class="btn btn-sm btn-outline-secondary text-capitalize"
            type="button"
            @click="add"
            value="Add"
          />
        </div>
      </div>
    </div>
    <router-view name="grid" :path="gridPath" />
    <router-view name="details" :path="detailsPath" @back="back" />
  </div>
</template>

<script>
export default {
  watch: {
    type: "load",
  },
  computed: {
    type() {
      return this.$route.params.type;
    },
    id() {
      return this.$route.params.id;
    },
  },
  created() {
    this.load();
  },
  methods: {
    load() {
      this.gridPath = `./${this.type}/grid`;
      this.detailsPath = `./${this.type}/details`;
    },
    add() {
      let url = `/${this.type}/new`;
      this.$router.push({ path: url });
    },
    back() {
      let url = `/${this.type}`;
      this.$router.push({ path: url });
    },
  },
  data() {
    return {
      gridPath: "",
      detailsPath: "",
    };
  },
};
</script>
