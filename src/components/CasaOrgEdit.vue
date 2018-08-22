<template>
  <div>
    <main class="main-content">
      <md-card>
        <md-card-header class="md-title">
          CasaOrg
        </md-card-header>
        <md-card-content>
          <md-field class="input-lg-width">
            <label>Name</label>
            <md-input v-model="form.CasaOrgName" autocomplete='CasaOrgName' v-on:blur="updateUser"></md-input>
          </md-field>
        </md-card-content>
      </md-card>
    </main>
  </div>
</template>
<script>
  import personService from '../services/person';
  import store from '../services/store';
  
  export default {
    data: () => ({
      form: {
        CasaOrgName: null,
      },
    }),
    store: ['state'],
    methods: {
      updateUser() {
        personService.personPut(localStorage.token, {
          ID: this.state.user.UserID,
          casaOrgName: this.form.CasaOrgName,
        }).then((res) => {
          console.log(res);
        }).catch((e) => {
          if (e.response.status === 401) {
            localStorage.token = '';
            this.$router.push('/');
          } else {
            console.log(e);
          }
        });
      },
    },
    mounted() {
      personService.personSelect(localStorage.token, this.state.user.CasaOrgID).then((res) => {
        let data = res.data[0][0];
        data = JSON.parse(data[Object.keys(data)[0]]);
        data = data.Person;
        this.form.CasaOrgName = data[0].CasaOrgName;
      }).catch((e) => {
        console.log(e);
        if (e.response.status === 401) {
          store.signOut();
        } else {
        }
      });
    },
  };
</script>