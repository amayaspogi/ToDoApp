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
        <div class="row">
          <div class="col-md-4 col-sm-8">
            <b-form-group label="Price Order">
              <b-form-input
                type="number"
                placeholder="Price Order"
                required
                autocomplete
                disabled
                v-model="priceOrder"
              />
            </b-form-group>
          </div>
        </div>
        <div class="row">
          <div class="col-md-4 col-sm-8">
            <b-form-group label="Service Category">
              <b-form-select
                v-model="serviceCategoryId"
                :options="list.serviceCategories"
                value-field="serviceCategoryId"
                text-field="name"
              ></b-form-select>
            </b-form-group>
          </div>
          <div class="col-md-4 col-sm-8">
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
            <b-button v-b-modal.productModal>Add Product</b-button>
            <b-table striped hover small :items="subProducts.items" :fields="subProducts.fields">
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
    priceOrder() {
      let items = this.subProducts.items;
      if (items.length > 0) {
        return items
          .map((x) => parseFloat(x.priceOrder))
          .reduce((x, y) => x + y);
      } else {
        return 0;
      }
    },
    availableProducts() {
      let available = this.list.products.items.filter((x) => {
        return (
          this.subProducts.items.filter((y) => {
            return y.productId == x.productId;
          }).length == 0
        );
      });
      return available;
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
        let query = { type: "package" };
        let url = `ContentService/Products/${this.id}`;
        let response = await this.$http.get(url, { query: query });

        this.name = response.name;
        this.description = response.description;
        this.serviceCategoryId = response.serviceCategoryId;
        this.serviceTypeId = response.serviceTypeId;
        this.subProducts.items = response.subProducts;
        this.zones.items = response.zones;

        this.list.serviceCategories = response.list.serviceCategories;
        this.list.serviceTypes = response.list.serviceTypes;

        this.loaded = true;
      } catch (ex) {
        this.$event.$emit("error", ex.message);
      }
    },
    async loadProducts() {
      try {
        let query = { type: "standalone" };
        let url = `ContentService/Products`;
        let response = await this.$http.get(url, { query: query });
        this.list.products.items = response.result;
      } catch (ex) {
        this.$event.$emit("error", ex.message);
      }
    },
    addProduct(row) {
      let product = this.list.products.items.filter((x) => {
        return x.productId == row.item.productId;
      })[0];

      this.subProducts.items.push({
        productId: product.productId,
        name: product.name,
        serviceType: product.serviceType,
        serviceCategory: product.serviceCategory,
        priceOrder: product.priceOrder,
      });
    },
    removeProduct(row) {
      this.subProducts.items.splice(row.index, 1);
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
        if (this.subProducts.items.length < 1) {
          throw new Error("Sub products required");
        }

        let subProducts = this.subProducts.items.map((x) => {
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
          priceOrder: this.priceOrder,
          serviceCategoryId: this.serviceCategoryId,
          serviceTypeId: this.serviceTypeId,
          subProducts: subProducts,
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
        if (this.subProducts.items.length < 1) {
          throw new Error("Sub products required");
        }

        let subProducts = this.subProducts.items.map((x) => {
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
          priceOrder: this.priceOrder,
          serviceCategoryId: this.serviceCategoryId,
          serviceTypeId: this.serviceTypeId,
          subProducts: subProducts,
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
      serviceCategoryId: "",
      serviceTypeId: "",
      zones: {
        items: [],
        fields: [{ key: "name" }, { key: "action", label: "" }],
      },
      subProducts: {
        items: [],
        fields: [
          { key: "name", sortable: true },
          { key: "serviceType", sortable: true },
          { key: "serviceCategory", sortable: true },
          { key: "priceOrder", sortable: true },
          { key: "action", label: "" },
        ],
      },
      list: {
        serviceCategories: [],
        serviceTypes: [],
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