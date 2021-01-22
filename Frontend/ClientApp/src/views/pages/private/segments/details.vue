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
          <div class="col-md-4 col-sm-8">
            <b-form-group label="Code">
              <b-form-input
                type="text"
                placeholder="Code"
                required
                autofocus
                autocomplete
                v-model="code"
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
            <b-button v-b-modal.typeCategoriesModal>Add Servie Type and Categories</b-button>
            <b-table
              striped
              hover
              small
              :items="typeCategories.items"
              :fields="typeCategories.fields"
            >
              <template v-slot:cell(action)="row">
                <a href="#" @click.prevent="removeTypeCategory(row)">delete</a>
              </template>
            </b-table>
          </div>
        </div>
        <hr class="mb-4" />
        <div class="row">
          <div class="col">
            <b-button v-b-modal.optionsModal @click.prevent="options.current = 'new'">Add Options</b-button>
            <b-table striped hover small :items="options.items" :fields="options.fields">
              <template v-slot:cell(name)="row">
                <a
                  href="#"
                  v-b-modal.optionsModal
                  @click.prevent="options.current = row.index"
                >{{ row.item.name }}</a>
              </template>
              <template v-slot:cell(action)="row">
                <a href="#" @click.prevent="removeOption(row)">delete</a>
              </template>
            </b-table>
          </div>
        </div>
        <hr class="mb-4" />
        <b-button squared block variant="dark" type="submit">Save</b-button>
      </b-form>
    </div>
    <b-modal id="optionsModal" title="Segment Options" ok-only v-if="currentOption">
      <div class="row">
        <div class="col-md-4 col-sm-8">
          <b-form-group label="Name">
            <b-form-input
              type="text"
              placeholder="Name"
              required
              autofocus
              autocomplete
              v-model="currentOption.name"
            />
          </b-form-group>
        </div>
      </div>
    </b-modal>
    <b-modal id="typeCategoriesModal" title="Available Service Type and Categories" ok-only>
      <b-table
        striped
        hover
        small
        :items="availableTypeCategories"
        :fields="list.typeCategories.fields"
      >
        <template v-slot:cell(action)="row">
          <a href="#" @click.prevent="addTypeCategory(row)">add</a>
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
    availableTypeCategories() {
      let available = this.list.typeCategories.items.filter((x) => {
        return (
          this.typeCategories.items.filter((y) => {
            return (
              y.serviceTypeId == x.serviceTypeId &&
              y.serviceCategoryId == x.serviceCategoryId
            );
          }).length == 0
        );
      });
      return available;
    },
    currentOption() {
      if (this.options.current == "new") {
        return {};
      } else {
        return this.options.items[this.options.current];
      }
    },
  },
  async mounted() {
    await this.load();
  },
  methods: {
    async load() {
      try {
        let url = `ContentService/Segments/${this.id}`;
        let response = await this.$http.get(url);

        this.name = response.name;
        this.code = response.code;
        this.description = response.description;
        this.typeCategories.items = response.typeCategories;
        this.options.items = response.options;

        this.list.typeCategories.items = response.list.typeCategories;

        this.loaded = true;
      } catch (ex) {
        this.$event.$emit("error", ex.message);
      }
    },
    addTypeCategory(row) {
      let typeCategory = this.list.typeCategories.items.filter((x) => {
        return (
          x.serviceTypeId == row.item.serviceTypeId &&
          x.serviceCategoryId == row.item.serviceCategoryId
        );
      })[0];

      this.typeCategories.items.push({
        serviceTypeId: typeCategory.serviceTypeId,
        serviceType: typeCategory.serviceType,
        serviceCategoryId: typeCategory.serviceCategoryId,
        serviceCategory: typeCategory.serviceCategory,
      });
    },
    removeTypeCategory(row) {
      this.typeCategories.items.splice(row.index, 1);
    },
    removeOption(row) {
      this.options.items.splice(row.index, 1);
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
      code: "",
      description: "",
      displayType: "",
      typeCategories: {
        items: [],
        fields: [
          { key: "serviceType" },
          { key: "serviceCategory" },
          { key: "action", label: "" },
        ],
      },
      options: {
        current: "",
        items: [],
        fields: [
          { key: "name", sortable: true },
          { key: "code", sortable: true },
          { key: "priceOrder", sortable: true },
          { key: "value", sortable: true },
          { key: "action", label: "" },
        ],
      },
      list: {
        typeCategories: {
          items: [],
          fields: [
            { key: "serviceType" },
            { key: "serviceCategory" },
            { key: "action", label: "" },
          ],
        },
        options: {
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
