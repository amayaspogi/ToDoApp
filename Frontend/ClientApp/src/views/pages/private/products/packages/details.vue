<template>
  <div class="row" v-if="loaded">
    <div class="col">
      <b-form class="form-signin" @submit.prevent="submit">
        <div class="row">
          <div class="col-md-4 col-sm-8">
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
          <div class="col-md-8">
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
        <hr class="mb-4" />
        <div class="row">
          <div class="col">
            <b-button v-b-modal.productModal>Add Product</b-button>
            <b-table striped hover small :items="products.items" :fields="products.fields">
              <template v-slot:cell(priceOrder)="row">
                <b-form-input v-model="row.item.priceOrder" />
              </template>
              <template v-slot:cell(action)="row">
                <a href="#" @click.prevent="removeProduct(row)">delete</a>
              </template>
            </b-table>
          </div>
        </div>
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
    <b-modal id="productModal" title="Available Products" ok-only @show.capture="loadProducts">
      <b-table striped hover small :items="availableProducts" :fields="list.products.fields">
        <template v-slot:cell(action)="row">
          <a href="#" @click.prevent="addProduct(row)">add</a>
        </template>
      </b-table>
    </b-modal>
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
    availableProducts() {
      let available = this.list.products.items.filter((x) => {
        return (
          this.products.items.filter((y) => {
            return y.productId == x.productId;
          }).length == 0
        );
      });
      return available;
    },
    availableZones() {
      let available = this.list.zones.items.filter((x) => {
        console.log(this.zones);
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
        let url = `ContentService/Packages/${this.id}`;
        let response = await this.$http.get(url);

        this.name = response.name;
        this.description = response.description;
        this.products.items = response.products;
        this.zones.items = response.zones;

        this.loaded = true;
      } catch (ex) {
        this.$event.$emit("error", ex.message);
      }
    },
    async loadProducts() {
      try {
        let url = `ContentService/Products`;
        let response = await this.$http.get(url);
        this.list.products.items = response.result;
      } catch (ex) {
        this.$event.$emit("error", ex.message);
      }
    },
    addProduct(row) {
      let product = this.list.products.items.filter((x) => {
        return x.productId == row.item.productId;
      })[0];

      this.products.items.push({
        productId: product.productId,
        name: product.name,
        serviceType: product.serviceType,
        serviceCategory: product.serviceCategory,
        type: product.type,
        priceOrder: product.priceOrder,
      });
    },
    removeProduct(row) {
      this.products.items.splice(row.index, 1);
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
        if (this.products.items.length < 1) {
          throw new Error("Products required");
        }

        let products = this.products.items.map((x) => {
          return {
            productId: x.productId,
            priceOrder: parseFloat(x.priceOrder),
          };
        });

        let zones = this.zones.items.map((x) => {
          return {
            zoneId: x.zoneId,
          };
        });

        let body = {
          name: this.name,
          description: this.description,
          products: products,
          zones: zones,
        };
        let url = `ContentService/Packages`;
        await this.$http.post(url, { body });

        this.$emit("back");
      } catch (ex) {
        this.$event.$emit("error", ex.message);
      }
    },
    async update() {
      try {
        if (this.products.items.length < 1) {
          throw new Error("Products required");
        }

        let products = this.products.items.map((x) => {
          return {
            productId: x.productId,
            priceOrder: parseFloat(x.priceOrder),
          };
        });

        let zones = this.zones.items.map((x) => {
          return {
            zoneId: x.zoneId,
          };
        });

        let body = {
          name: this.name,
          description: this.description,
          products: products,
          zones: zones,
        };
        let url = `ContentService/Packages/${this.id}`;
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
      zones: {
        items: [],
        fields: [{ key: "name" }, { key: "action", label: "" }],
      },
      products: {
        items: [],
        fields: [
          { key: "name", sortable: true },
          { key: "serviceType", sortable: true },
          { key: "serviceCategory", sortable: true },
          { key: "type", sortable: true },
          { key: "priceOrder", sortable: true },
          { key: "action", label: "" },
        ],
      },
      list: {
        zones: {
          items: [],
          fields: [{ key: "name" }, { key: "action", label: "" }],
        },
        products: {
          items: [],
          fields: [
            { key: "name", sortable: true },
            { key: "serviceType", sortable: true },
            { key: "serviceCategory", sortable: true },
            { key: "action", label: "" },
          ],
        },
      },
      loaded: false,
    };
  },
};
</script>
