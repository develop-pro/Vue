<template>
  <md-card>
    <md-card-header>
    </md-card-header>
    <md-card-content>
      <md-autocomplete v-model="vSearch" :md-options="contact"  @md-changed="getContacts" @md-opened="getContacts" @md-selected="setContact">
        <label>Search Google Contacts</label>
        <template slot="md-autocomplete-item" slot-scope="{ item, term }">
          <md-highlight-text :md-term="term">{{ item.FirstName }} {{ item.LastName }}</md-highlight-text>
        </template>
      </md-autocomplete>
    </md-card-content>
  </md-card>
</template>

<script>
export default {
  data() {
    return {
      show5: false,
      vSearch: null,
      contact: [],
    };
  },
  methods: {
    getContacts(searchTerm) {
      console.log(searchTerm);
      // if (!searchTerm) {
      //   return;
      // }
      // this.unit = new Promise((resolve) => {
      //   if (!searchTerm) {
      //     resolve(this.state.units);
      //   } else {
      //     let term = '';
      //     if (isObject(searchTerm)) {
      //       term = `${searchTerm.FirstName} ${searchTerm.LastName} ${searchTerm.Address1}`;
      //       this.vSearch = term;
      //     } else {
      //       term = searchTerm.toLowerCase();
      //     }
      //     const filter = obj => (obj.Address1 && obj.Address1.toLowerCase().includes(term)) || (obj.FirstName && obj.FirstName.toLowerCase().includes(term)) || (obj.LastName && obj.LastName.toLowerCase().includes(term)) || (obj.Tenants && obj.Tenants.toLowerCase().includes(term));
      //     resolve(
      //       this.state.units.filter(filter),
      //     );
      //     // resolve(this.units.filter(({ Address1, FirstName, LastName }) => { return (Address1 && Address1.toLowerCase().includes(term)) || (FirstName && FirstName.toLowerCase().includes(term)) || (LastName && LastName.toLowerCase().includes(term)); }));
      //   }
      // });
    },
    setContact(selectedTerm) {
      console.log(selectedTerm);
    },
  },
  mounted() {
  },
};
</script>