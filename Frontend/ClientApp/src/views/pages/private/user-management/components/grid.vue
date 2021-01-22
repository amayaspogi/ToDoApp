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
      :fields="fields"
      :items="filteredUsers"
      :sort-by.sync="sortBy"
      :sort-desc.sync="sortDesc"
    >
      <template v-slot:cell(name)="{ item, value }">
        <router-link v-bind:to="{ path: userUrl(item.userId) }">
          {{
          value
          }}
        </router-link>
      </template>
      <template v-slot:cell(dateVerified)="{ item, value }">
        <div v-if="!defaultDate(value)">{{ localDate(value) }}</div>
        <router-link
          v-else
          :to="{ path: `/signup-complete?token=${item.verificationCode}` }"
        >Verify Login</router-link>
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
    filteredUsers() {
      return this.users.filter((user) => {
        return (
          user.name.toLowerCase().includes(this.searchText.toLowerCase()) ||
          user.email.toLowerCase().includes(this.searchText.toLowerCase()) ||
          user.role.toLowerCase().includes(this.searchText.toLowerCase()) ||
          user.accountLevel
            .toLowerCase()
            .includes(this.searchText.toLowerCase())
        );
      });
    },
  },
  watch: {
    type: "load",
  },
  async mounted() {
    await this.load();
  },
  methods: {
    async load() {
      try {
        let query = { type: this.type };
        let url = `ProfileService/Users`;
        let response = await this.$http.get(url, { query });
        this.users = response.result;
      } catch (ex) {
        this.$event.$emit("error", ex.message);
      }
    },
    defaultDate(utc) {
      return utc == "0001-01-01T00:00:00";
    },
    localDate(utc) {
      utc = utc.replace("T", " ");
      if (utc == "0001-01-01 00:00:00") return "";
      let date = new Date(`${utc} UTC`);
      return date.toLocaleString();
    },
    userUrl(userId) {
      let url = `/${this.type}-user/${userId}`;
      return url;
    },
  },
  data() {
    return {
      sortBy: "name",
      sortDesc: false,
      users: [],
      fields: [
        { key: "name", sortable: true },
        { key: "email", sortable: true },
        { key: "role", sortable: true },
        { key: "accountLevel", sortable: true, label: "Permission" },
        { key: "dateVerified", sortable: true, label: "Verified" },
      ],
      searchText: "",
    };
  },
};
</script>
