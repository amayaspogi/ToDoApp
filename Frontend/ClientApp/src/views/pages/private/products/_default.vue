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
    <nav>
      <div class="nav nav-tabs" id="nav-tab" role="tablist">
        <router-link class="nav-item nav-link" to="/products">Products</router-link>
        <router-link class="nav-item nav-link" to="/packages">Packages</router-link>
        <router-link class="nav-item nav-link" to="/product-packages">Product Packages</router-link>
      </div>
    </nav>
    <div class="tab-content mt-4">
      <div class="tab-pane fade show active">
        <router-view name="grid" :path="gridPath" />
        <router-view name="details" :path="detailsPath" @back="back" />
      </div>
    </div>
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
      this.gridPath = `./products/${this.type}/grid`;
      this.detailsPath = `./products/${this.type}/details`;
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
