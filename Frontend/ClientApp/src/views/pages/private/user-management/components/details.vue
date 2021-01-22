<template>
  <div class="row" v-if="loaded">
    <div class="col-md-8 col-sm-12">
      <h4 class="mb-3 text-capitalize">{{ isNew ? "Add" : "Update" }} User</h4>
      <b-form class="form-signin" @submit.prevent="submit">
        <div class="row">
          <div class="col-md-6">
            <b-form-group label="First Name">
              <b-form-input
                type="text"
                placeholder="First Name"
                required
                autofocus
                autocomplete
                v-model="firstName"
              />
            </b-form-group>
          </div>
          <div class="col-md-6">
            <b-form-group label="Last Name">
              <b-form-input
                type="text"
                placeholder="Last Name"
                required
                autocomplete
                v-model="lastName"
              />
            </b-form-group>
          </div>
        </div>
        <div class="row">
          <div class="col-md-12">
            <b-form-group label="Email">
              <b-form-input
                type="email"
                placeholder="Email address"
                required
                autocomplete
                v-model="email"
                :disabled="!isNew"
              />
            </b-form-group>
          </div>
        </div>
        <div class="row">
          <div class="col-md-6">
            <b-form-group label="Role">
              <b-form-select v-model="role" :options="roles" value-field="code" text-field="name"></b-form-select>
            </b-form-group>
          </div>
          <div class="col-md-6">
            <b-form-group label="Access Level">
              <b-form-select
                v-model="accessLevel"
                :options="accessLevels"
                value-field="code"
                text-field="name"
              ></b-form-select>
            </b-form-group>
          </div>
        </div>
        <hr class="mb-4" />
        <b-button squared block variant="dark" type="submit">Save</b-button>
      </b-form>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    id() {
      return this.isCurrent
        ? this.$store.getters.userId
        : this.$route.params.id;
    },
    type() {
      return this.$route.params.type;
    },
    isNew() {
      return this.id == "new";
    },
    isCurrent() {
      return this.$route.params.id == "current";
    },
  },
  watch: {
    id: "load",
  },
  async mounted() {
    await this.load();
  },
  methods: {
    async load() {
      try {
        let query = { type: this.type };
        let url = `ProfileService/Users/${this.id}`;
        let response = await this.$http.get(url, { query });

        this.firstName = response.firstName;
        this.lastName = response.lastName;
        this.email = response.email;
        this.role = response.role;
        this.accessLevel = response.accessLevel;
        this.roles = response.roles;
        this.accessLevels = response.accessLevels;

        this.loaded = true;
      } catch (ex) {
        this.$event.$emit("error", ex.message);
      }
    },
    async submit() {
      if (this.isNew) {
        await this.add();
      } else {
        await this.update();
      }
    },
    async add() {
      try {
        let body = {
          firstName: this.firstName,
          lastName: this.lastName,
          email: this.email,
          type: this.type,
          role: this.role,
          accessLevel: this.accessLevel,
        };
        let url = `ProfileService/Users`;
        await this.$http.post(url, { body });

        this.$emit("back");
      } catch (ex) {
        this.$event.$emit("error", ex.message);
      }
    },
    async update() {
      try {
        let body = {
          firstName: this.firstName,
          lastName: this.lastName,
          type: this.type,
          role: this.role,
          accessLevel: this.accessLevel,
        };
        let url = `ProfileService/Users/${this.id}`;
        await this.$http.patch(url, { body });

        if (!this.isCurrent) {
          this.$emit("back");
        }
        this.$event.$emit("info", "User update");
      } catch (ex) {
        this.$event.$emit("error", ex.message);
      }
    },
  },
  data() {
    return {
      firstName: "",
      lastName: "",
      email: "",
      role: "",
      accessLevel: "",
      roles: [],
      accessLevels: [],
      loaded: false,
    };
  },
};
</script>
