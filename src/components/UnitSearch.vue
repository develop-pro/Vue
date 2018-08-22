<template>
  <md-autocomplete v-model="vSearch" :md-options="unit"  @md-changed="getUnits" @md-opened="getUnits" @md-selected="setUnit">
    <label>{{placeholder}}</label>
    <template slot="md-autocomplete-item" slot-scope="{ item, term }">
      <div>
        <md-highlight-text :md-term="term">{{ item.Address1 }}</md-highlight-text>
        <div class='tenants'>
          <div v-for="tenant in item.Tenants" :key="tenant.FirstName">
            <md-highlight-text :md-term="term">{{tenant.FirstName}} {{tenant.LastName}}&nbsp;&nbsp;&nbsp;</md-highlight-text>
          </div>
        </div>
      </div>
    </template>
    <md-icon v-if="showSearch">search</md-icon>
  </md-autocomplete>
</template>

<style>
  .tenants {
    margin: 10px 0 0 20px;
    display: flex;
    flex-direction: row;
  }
</style>
<script>
const isObject = require('isobject');

export default {
  data() {
    return {
      show5: false,
      vSearch: null,
      unit: [],
      showSearch: true,
    };
  },
  props: {
    placeholder: {
      type: String,
      default: null,
    },
  },
  store: ['state'],
  methods: {
    unitSummary() {
      this.$router.push('/unitSummary');
    },
    getUnits(searchTerm) {
      if (searchTerm === '') {
        this.showSearch = true;
      } else if (this.vSearch || searchTerm) {
        this.showSearch = false;
      } else {
        this.showSearch = true;
      }
      if (!searchTerm) {
        return;
      }
      this.unit = new Promise((resolve) => {
        if (!searchTerm) {
          resolve(this.state.units);
        } else {
          let term = '';
          if (isObject(searchTerm)) {
            term = `${searchTerm.Address1}`;
          } else {
            term = searchTerm.toLowerCase();
          }
          const filter = obj => (obj.Address1 && obj.Address1.toLowerCase().includes(term)) ||
          (obj.Tenants && obj.Tenants.filter(({ FirstName, LastName }) =>
            (FirstName && FirstName.toLowerCase().includes(term)) || (LastName && LastName.toLowerCase().includes(term)),
          ).length > 0);
          resolve(
            this.state.units.filter(filter),
          );
        }
      });
    },
    setUnit(selectedTerm) {
      this.$emit('onSelectUnit', Number(selectedTerm.UnitID));
      setTimeout(() => {
        this.vSearch = this.vSearch.Address1;
      }, 200);
    },
  },
  mounted() {
  },
};
</script>