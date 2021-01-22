<template>
  <div class="row" v-if="loaded">
    <div class="col">
      <b-form class="form-signin" @submit.prevent="submit">
        <div class="row">
          <div class="col-md-6">
            <b-form-group label="Name">
              <b-form-input
                type="text"
                placeholder="Name"
                required
                autofocus
                autocomplete
                v-model="name"
              />
            </b-form-group>
          </div>
        </div>
        <div class="row">
          <div class="col-md-12">
            <b-form-group label="Description">
              <b-form-input
                type="text"
                placeholder="Description"
                required
                autocomplete
                v-model="description"
              />
            </b-form-group>
          </div>
        </div>
        <div class="row">
          <div class="col-md-6">
            <b-form-group label="Price Order">
              <b-form-input
                type="number"
                placeholder="Price Order"
                required
                autocomplete
                v-model="priceOrder"
              />
            </b-form-group>
          </div>
        </div>
        <div class="row">
          <div class="col-md-6">
            <b-form-group label="Service Category">
              <b-form-select
                v-model="serviceCategoryId"
                :options="list.serviceCategories"
                value-field="serviceCategoryId"
                text-field="name"
              ></b-form-select>
            </b-form-group>
          </div>
          <div class="col-md-6">
            <b-form-group label="Service Type">
              <b-form-select
                v-model="serviceTypeId"
                :options="list.serviceTypes"
                value-field="serviceTypeId"
                text-field="name"
              ></b-form-select>
            </b-form-group>
          </div>
        </div>
        <hr class="mb-4" />
        <div class="row">
          <div class="col">
            <b-button v-b-modal.zoneModal>Add Zone</b-button>
            <b-table striped hover small :items="zones.items" :fields="zones.fields">
              <template v-slot:cell(action)="row">
                <a href="#" @click.prevent="removeZone(row)">delete</a>
              </template>
            </b-table>
          </div>
        </div>
        <hr class="mb-4" />
        <b-button squared block variant="dark" type="submit">Save</b-button>
      </b-form>
    </div>
    <b-modal id="zoneModal" title="Available Zones" ok-only @show.capture="loadZones">
      <b-table striped hover small :items="availableZones" :fields="list.zones.fields">
        <template v-slot:cell(action)="row">
          <a href="#" @click.prevent="addZone(row)">add</a>
        </template>
      </b-table>
    </b-modal>
  </div>
</template>

<script>
export default {
  computed: {
    id() {
      return this.$route.params.id;
    },
    type() {
      return this.$route.params.type;
    },
    isNew() {
      return this.id == "new";
    },
    priceOrderVal() {
      return parseFloat(this.priceOrder);
    },
    availableZones() {
      let available = this.list.zones.items.filter((x) => {
        return (
          this.zones.items.filter((y) => {
            return y.zoneId == x.zoneId;
          }).length == 0
        );
      });
      return available;
    },
  },
  async mounted() {
    await this.load();
  },
  methods: {
    async load() {
      try {
        let query = { type: "standalone" };
        let url = `ContentService/Products/${this.id}`;
        let response = await this.$http.get(url, { query: query });

        this.name = response.name;
        this.description = response.description;
        this.priceOrder = parseFloat(response.priceOrder);
        this.serviceCategoryId = response.serviceCategoryId;
        this.serviceTypeId = response.serviceTypeId;
        this.zones.items = response.zones;

        this.list.serviceCategories = response.list.serviceCategories;
        this.list.serviceTypes = response.list.serviceTypes;

        this.loaded = true;
      } catch (ex) {
        this.$event.$emit("error", ex.message);
      }
    },
    async loadZones() {
      try {
        let url = `AdminService/Zones`;
        let response = await this.$http.get(url);
        this.list.zones.items = response.result;
      } catch (ex) {
        this.$event.$emit("error", ex.message);
      }
    },
    addZone(row) {
      let zone = this.list.zones.items.filter((x) => {
        return x.zoneId == row.item.zoneId;
      })[0];

      this.zones.items.push({
        zoneId: zone.zoneId,
        name: zone.name,
      });
    },
    removeZone(row) {
      this.zones.items.splice(row.index, 1);
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
        let zones = this.zones.items.map((x) => {
          return {
            zoneId: x.zoneId,
          };
        });

        let body = {
          name: this.name,
          description: this.description,
          priceOrder: this.priceOrderVal,
          serviceCategoryId: this.serviceCategoryId,
          serviceTypeId: this.serviceTypeId,
          zones: zones,
        };
        let url = `ContentService/Products`;
        await this.$http.post(url, { body });

        this.$emit("back");
      } catch (ex) {
        this.$event.$emit("error", ex.message);
      }
    },
    async update() {
      try {
        let zones = this.zones.items.map((x) => {
          return {
            zoneId: x.zoneId,
          };
        });

        let body = {
          name: this.name,
          description: this.description,
          priceOrder: this.priceOrderVal,
          serviceCategoryId: this.serviceCategoryId,
          serviceTypeId: this.serviceTypeId,
          zones: zones,
        };
        let url = `ContentService/Products/${this.id}`;
        await this.$http.patch(url, { body });

        this.$emit("back");
      } catch (ex) {
        this.$event.$emit("error", ex.message);
      }
    },
  },
  data() {
    return {
      name: "",
      description: "",
      priceOrder: 0,
      serviceCategoryId: "",
      serviceTypeId: "",
      zones: {
        items: [],
        fields: [{ key: "name" }, { key: "action", label: "" }],
      },
      list: {
        zones: {
          items: [],
          fields: [{ key: "name" }, { key: "action", label: "" }],
        },
      },
      loaded: false,
    };
  },
};
</script>