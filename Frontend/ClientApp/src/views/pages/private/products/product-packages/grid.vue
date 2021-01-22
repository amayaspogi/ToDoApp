<template>
  <div>
    <b-form-group>
      <b-input-group>
        <b-form-input
          type="search"
          placeholder="Search..."
          v-model="searchText"
          autofocus
          debounce="300"
        />
        <b-input-group-append>
          <b-button>
            <b-icon icon="search"></b-icon>
          </b-button>
        </b-input-group-append>
      </b-input-group>
    </b-form-group>
    <b-table
      striped
      hover
      small
      :items="items"
      :fields="fields"
      :sort-by.sync="sortBy"
      :sort-desc.sync="sortDesc"
    >
      <template v-slot:cell(name)="{ item, value }">
        <router-link v-bind:to="{ path: `/${type}/${item.productId}` }">
          {{
          value
          }}
        </router-link>
      </template>
    </b-table>
  </div>
</template>

<script>
export default {
  computed: {
    type() {
      return this.$route.params.type;
    },
  },
  async mounted() {
    await this.load();
  },
  methods: {
    async load() {
      try {
        let query = { type: "package" };
        let url = `ContentService/Products`;
        let response = await this.$http.get(url, { query: query });
        this.items = response.result;
      } catch (ex) {
        this.$event.$emit("error", ex.message);
      }
    },
  },
  data() {
    return {
      items: [],
      fields: [
        { key: "name", sortable: true },
        { key: "description", sortable: true },
        { key: "serviceType", sortable: true },
        { key: "serviceCategory", sortable: true },
        { key: "priceOrder", sortable: true },
      ],
      sortBy: "name",
      sortDesc: false,
      searchText: "",
    };
  },
};
</script>
